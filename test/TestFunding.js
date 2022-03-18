const { expect, assert } = require("chai");
const { ethers, waffle } = require("hardhat");
const chai = require('chai');
const should = require('chai').should();
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


describe("Funding", function () {
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
        const goal_amount = ethers.utils.parseEther("1.1");
        const deadline_blocks_num = 3;
        const Project = await ethers.getContractFactory("ProjectStandard");
        project = await Project.deploy(owner, receiver_addr, title, description, goal_amount, deadline_blocks_num);

        await expect(project.connect(buyer1).getCurrentState())
        .to.emit(project, "stateInfo")
        .withArgs(buyer1.address, buyer1.address, title, description, ethers.BigNumber.from(0), ethers.BigNumber.from(goal_amount), ethers.BigNumber.from(0), ethers.BigNumber.from(deadline_blocks_num), []);

    })


  });
