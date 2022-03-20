const { expect, assert } = require("chai");
const { ethers, waffle } = require("hardhat");
const chai = require('chai');
const should = require('chai').should();
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


describe("Test Funding", function () {
    describe("Test Project Construtor", function(){
        let owner, buyer1, buyer2, provider, Project;
        beforeEach(async() => {
            [owner, buyer1, buyer2] = await ethers.getSigners();
            provider = waffle.provider;
    
        })
        it('project state should be set properly after call the constructor', async () => {
            const owner = buyer1.address;
            const receiver_addr = buyer1.address;
            const title = "I'm Title";
            const description = "I'm Description";
            const img_url = "";
            const goal_amount = ethers.utils.parseEther("1.1");
            const duration = 3;
            const Project = await ethers.getContractFactory("ProjectStandard");
            project = await Project.deploy(owner, receiver_addr, title, description, img_url, goal_amount, duration);
            const timestamp = (await provider.getBlock(await(project.deployTransaction.wait()).blockNumber)).timestamp;
            await expect(project.connect(buyer1).getCurrentState())
            .to.emit(project, "stateInfo")
            .withArgs(buyer1.address, buyer1.address, title, description, img_url, ethers.BigNumber.from(0), ethers.BigNumber.from(goal_amount), ethers.BigNumber.from(0), timestamp, ethers.BigNumber.from(duration), []);
    
        })

    });

    describe("Test Project contribute function", function(){
        let owner, receiver, investor1, investor2, provider, project;
        beforeEach(async() => {
            [owner, receiver, investor1, investor2] = await ethers.getSigners();
            provider = waffle.provider;
    
            const owner_addr = owner.address;
            const receiver_addr = receiver.address;
            const title = "I'm Title";
            const description = "I'm Description";
            const img_url = "";
            const goal_amount = ethers.utils.parseEther("1.1");
            const duration = 3;
            const Project = await ethers.getContractFactory("ProjectStandard");
            project = await Project.deploy(owner_addr, receiver_addr, title, description, img_url, goal_amount, duration);
        })
        it('investors cannot contribute to the project if it has been completed or cancelled.', async () => {
            // set to inactive
            await project.connect(owner).completeProject();
            const isActive = (await project.state()).active;
            expect(isActive).to.equal(false);
            // attempt to contribute
            await expect(project.connect(investor1).contribute({value: ethers.utils.parseEther("1.1")})).to.be.reverted;
        })
        it('investors cannot contribute to the project if the deadline has passed.', async () => {
            // pass 4 days
            await hre.ethers.provider.send('evm_increaseTime', [4 * 24 * 60 * 60]);
            // attempt to contribute
            await expect(project.connect(investor1).contribute({value: ethers.utils.parseEther("1.1")})).to.be.reverted;
        })
        it('investors can contribute to the project if everything is OK.', async () => {
            // check active
            const isActive = (await project.state()).active;
            expect(isActive).to.equal(true);
            // attempt to contribute
            expect(await project.connect(investor1).contribute({value: ethers.utils.parseEther("1.1")}));
        })
        it('project contract should have the correct ether balance after an investment.', async () => {
            // contribute
            await project.connect(investor1).contribute({value: ethers.utils.parseEther("1.1")});
            // check balance
            const contractBalance = ethers.BigNumber.from(await provider.getBalance(project.address));
            expect(ethers.utils.parseEther("1.1")).to.equal(contractBalance);
        })
    });

    describe("Test Project complete function", function(){
        let owner, receiver, investor1, investor2, provider, project;
        beforeEach(async() => {
            [owner, receiver, investor1, investor2] = await ethers.getSigners();
            provider = waffle.provider;
    
            const owner_addr = owner.address;
            const receiver_addr = receiver.address;
            const title = "I'm Title";
            const description = "I'm Description";
            const img_url = "";
            const goal_amount = ethers.utils.parseEther("1.1");
            const duration = 3;
            const Project = await ethers.getContractFactory("ProjectStandard");
            project = await Project.deploy(owner_addr, receiver_addr, title, description, img_url, goal_amount, duration);
        })
        it('only the owner of the project can complete the project.', async () => {
            // check owner
            const projectOwner = (await project.state()).owner;
            expect(projectOwner).to.not.equal(investor1.address);
            // attempt to complete project from investor
            await expect(project.connect(investor1).completeProject()).to.be.reverted;
        })
        it('project cannot be completed if it has been completed or cancelled.', async () => {
            // set to inactive
            await project.connect(owner).completeProject();
            const isActive = (await project.state()).active;
            expect(isActive).to.equal(false);
            // attempt to complete project
            await expect(project.connect(owner).completeProject()).to.be.reverted;
        })
        it('project can be completed if everything is OK.', async () => {
            // check owner and status
            const projectOwner = (await project.state()).owner;
            const isActive = (await project.state()).active;
            expect(projectOwner).to.equal(owner.address);
            expect(isActive).to.equal(true);
            // attempt to complete project
            expect(await project.connect(owner).completeProject());
        })
        it('ethers should be transferred to the receiver if the project is completed.', async () => {
            // investors contribute to the project
            await project.connect(investor1).contribute({value: ethers.utils.parseEther("1.1")});
            await project.connect(investor2).contribute({value: ethers.utils.parseEther("2.2")});

            const receiverBalanceBefore = ethers.BigNumber.from(await receiver.getBalance());
            // complete project
            await project.connect(owner).completeProject();

            const projectBalance = ethers.BigNumber.from(await provider.getBalance(project.address));
            const receiverBalanceAfter = ethers.BigNumber.from(await receiver.getBalance());
            // check investor's balance
            expect(receiverBalanceAfter.sub(receiverBalanceBefore)).to.equal(ethers.utils.parseEther("3.3"));
            // check project balance
            expect(projectBalance).to.equal(ethers.BigNumber.from(0));
        })
    });


    describe("Test Project cancel function", function(){
        let owner, receiver, investor1, investor2, provider, project;
        beforeEach(async() => {
            [owner, receiver, investor1, investor2] = await ethers.getSigners();
            provider = waffle.provider;
    
            const owner_addr = owner.address;
            const receiver_addr = receiver.address;
            const title = "I'm Title";
            const description = "I'm Description";
            const img_url = "";
            const goal_amount = ethers.utils.parseEther("1.1");
            const duration = 3;
            const Project = await ethers.getContractFactory("ProjectStandard");
            project = await Project.deploy(owner_addr, receiver_addr, title, description, img_url, goal_amount, duration);
        })
        it('only the owner of the project can cancel the project.', async () => {
            // check owner
            const projectOwner = (await project.state()).owner;
            expect(projectOwner).to.not.equal(investor1.address);
            // attempt to cancel project from investor
            await expect(project.connect(investor1).cancelProject()).to.be.reverted;
        })
        it('project cannot be cancelled if it has been completed or cancelled.', async () => {
            // set to inactive
            await project.connect(owner).completeProject();
            const isActive = (await project.state()).active;
            expect(isActive).to.equal(false);
            // attempt to cancel project
            await expect(project.connect(owner).cancelProject()).to.be.reverted;
        })
        it('project can be cancelled if everything is OK.', async () => {
            // check owner and status
            const projectOwner = (await project.state()).owner;
            const isActive = (await project.state()).active;
            expect(projectOwner).to.equal(owner.address);
            expect(isActive).to.equal(true);
            // attempt to cancel project
            expect(await project.connect(owner).cancelProject());
        })
        it('ethers should be refunded to investors if the project is cancelled.', async () => {
            // investors contribute to the project
            await project.connect(investor1).contribute({value: ethers.utils.parseEther("1.1")});
            await project.connect(investor2).contribute({value: ethers.utils.parseEther("2.2")});

            const investor1BalanceBefore = ethers.BigNumber.from(await investor1.getBalance());
            const investor2BalanceBefore = ethers.BigNumber.from(await investor2.getBalance());
            // cancel project
            await project.connect(owner).cancelProject();

            const projectBalance = ethers.BigNumber.from(await provider.getBalance(project.address));
            const investor1BalanceAfter = ethers.BigNumber.from(await investor1.getBalance());
            const investor2BalanceAfter = ethers.BigNumber.from(await investor2.getBalance());
            // check investor's balance
            expect(investor1BalanceAfter.sub(investor1BalanceBefore)).to.equal(ethers.utils.parseEther("1.1"));
            expect(investor2BalanceAfter.sub(investor2BalanceBefore)).to.equal(ethers.utils.parseEther("2.2"));
            // check project balance
            expect(projectBalance).to.equal(ethers.BigNumber.from(0));
        })
    });

    describe("Test Project change duration function", function(){
        let owner, receiver, investor1, investor2, provider, project;
        beforeEach(async() => {
            [owner, receiver, investor1, investor2] = await ethers.getSigners();
            provider = waffle.provider;
    
            const owner_addr = owner.address;
            const receiver_addr = receiver.address;
            const title = "I'm Title";
            const description = "I'm Description";
            const img_url = "";
            const goal_amount = ethers.utils.parseEther("1.1");
            const duration = 3;
            const Project = await ethers.getContractFactory("ProjectStandard");
            project = await Project.deploy(owner_addr, receiver_addr, title, description, img_url, goal_amount, duration);
        })
        it('project duration can only be changed by the owner.', async () => {
            // check owner
            const projectOwner = (await project.state()).owner;
            expect(projectOwner).to.not.equal(investor1.address);
            // attempt to change duration from investor
            await expect(project.connect(investor1).changeDuration(10)).to.be.reverted;
        })
        it('project duration can only be changed when the project has been completed or cancelled.', async () => {
            // set to inactive
            await project.connect(owner).completeProject();
            const isActive = (await project.state()).active;
            expect(isActive).to.equal(false);
            // attempt to change duration
            await expect(project.connect(owner).changeDuration(10)).to.be.reverted;
        })
        it('project duration can only be changed within original duration.', async () => {
            // pass 4 days
            await hre.ethers.provider.send('evm_increaseTime', [4 * 24 * 60 * 60]);
            // attempt to change duration
            await expect(project.connect(owner).changeDuration(10)).to.be.reverted;
        })
        it('project duration can only be extended.', async () => {
            // attempt to shorten duration
            await expect(project.connect(owner).changeDuration(1)).to.be.reverted;
        })
        it('project duration cannot be extended once the funding goal is reached.', async () => {
            // investor contribute to the project
            await project.connect(investor1).contribute({value: ethers.utils.parseEther("1.1")});
            // attempt to change duration
            await expect(project.connect(owner).changeDuration(10)).to.be.reverted;
        })
        it('project duration can be changed if everything is OK.', async () => {
            // check active and owner
            const isActive = (await project.state()).active;
            const projectOwner = (await project.state()).owner;
            expect(isActive).to.equal(true);
            expect(projectOwner).to.equal(owner.address);
            // attempt to change duration
            expect(await project.connect(owner).changeDuration(10));
        })
    });

    describe("Test Lottery Project", function(){
        let owner, receiver, investor1, investor2, provider, project;
        beforeEach(async() => {
            [owner, receiver, investor1, investor2] = await ethers.getSigners();
            provider = waffle.provider;
    
            const owner_addr = owner.address;
            const receiver_addr = receiver.address;
            const title = "I'm Title";
            const description = "I'm Description";
            const img_url = "";
            const goal_amount = ethers.utils.parseEther("1.1");
            const duration = 3;
            const percentage = 50;
            const Project = await ethers.getContractFactory("ProjectLottery");
            project = await Project.deploy(owner_addr, receiver_addr, title, description, img_url, goal_amount, duration, percentage);
        })
        it('prize pool should be updated correctly after investments.', async () => {
            // contribute
            await project.connect(investor1).contribute({value: ethers.utils.parseEther("2")});
            await project.connect(investor2).contribute({value: ethers.utils.parseEther("8")});
            // check prize
            const prizePool = (await project.lottery()).prize;
            expect(prizePool).to.equal(ethers.utils.parseEther("5"));
        })
        it('a winner should be drawn when the project completes.', async () => {
            // contribute
            await project.connect(investor1).contribute({value: ethers.utils.parseEther("2")});
            await project.connect(investor2).contribute({value: ethers.utils.parseEther("2")});
            // complete project
            await project.connect(owner).completeProject();
            // check winner
            const winnerAddress = (await project.lottery()).winner;
            assert(winnerAddress == investor1.address || winnerAddress == investor2.address);
        })
        it('lottery winner and project receiver should have the correct amount of ethers after the lottery is drawn.', async () => {
            // contribute
            await project.connect(investor1).contribute({value: ethers.utils.parseEther("2")});
            await project.connect(investor2).contribute({value: ethers.utils.parseEther("2")});

            const investor1BalanceBefore = ethers.BigNumber.from(await investor1.getBalance());
            const investor2BalanceBefore = ethers.BigNumber.from(await investor2.getBalance());
            const receiverBalanceBefore = ethers.BigNumber.from(await receiver.getBalance());
            const prizePool = ethers.BigNumber.from((await project.lottery()).prize);
            const funds = await provider.getBalance(project.address);

            // complete project
            await project.connect(owner).completeProject();

            const investor1BalanceAfter = ethers.BigNumber.from(await investor1.getBalance());
            const investor2BalanceAfter = ethers.BigNumber.from(await investor2.getBalance());
            const receiverBalanceAfter = ethers.BigNumber.from(await receiver.getBalance());

            // check balance
            const winnerAddress = (await project.lottery()).winner;
            if(winnerAddress == investor1.address){
                expect(investor1BalanceAfter.sub(investor1BalanceBefore)).to.equal(prizePool);
                expect(investor2BalanceAfter).to.equal(investor2BalanceBefore);
            } else {
                expect(investor2BalanceAfter.sub(investor2BalanceBefore)).to.equal(prizePool);
                expect(investor1BalanceAfter).to.equal(investor1BalanceBefore);
            }
            expect(receiverBalanceAfter.sub(receiverBalanceBefore)).to.equal(funds.sub(prizePool));
        })
    });

    describe("Test Project Manager", function(){
        let owner, buyer1, provider, Project;
        beforeEach(async() => {
            [owner, buyer1] = await ethers.getSigners();
            provider = waffle.provider;
    
        })
        it('project info should be set properly after call function createProject', async () => {
            const owner = buyer1.address;
            const receiver_addr = buyer1.address;
            const title = "I'm Title";
            const description = "I'm Description";
            const img_url = "www.hualahuala.com/image1";
            const goal_amount = ethers.utils.parseEther("1.1");
            const deadline_blocks_num = 3;
            const Manager = await ethers.getContractFactory("Manager");
            manager = await Manager.deploy();

            await expect(manager.connect(buyer1).createProject(receiver_addr, title, description, img_url, goal_amount, deadline_blocks_num))
            .to.emit(manager, "NewProject")
            .withArgs(owner, receiver_addr, title, description, img_url, ethers.BigNumber.from(goal_amount), ethers.BigNumber.from(deadline_blocks_num));
    
        })
        it('project info will be pushed into project array after call function createProject', async () => {
            const owner = buyer1.address;
            const receiver_addr = buyer1.address;
            const title = "I'm Title";
            const description = "I'm Description";
            const img_url = "www.hualahuala.com/image1";
            const goal_amount = ethers.utils.parseEther("1.1");
            const deadline_blocks_num = 3;
            const Manager = await ethers.getContractFactory("Manager");
            manager = await Manager.deploy();
            let projects = await manager.getAllProjects();
            expect(projects.length).to.equal(0);
            await manager.createProject(receiver_addr, title, description, img_url, goal_amount, deadline_blocks_num);
            projects = await manager.getAllProjects();
            expect(projects.length).to.equal(1);
            // expect(projects[0].owner).to.equal(owner);
            // expect(projects[0].receiver).to.equal(receiver_addr);
            // expect(projects[0].title).to.equal(title);
            // expect(projects[0].description).to.equal(description);
            // expect(projects[0].img_url).to.equal(img_url);
            // expect(projects[0].goal_amount).to.equal(goal_amount);
            // expect(projects[0].deadline_blocks_num).to.equal(deadline_blocks_num);
        })
    });


  });
