// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract Manager{

    ProjectStandard[] public projects;

    event NewProject(
        address contractAddr,
        address owner,
        address receiver,
        string title,
        string description,
        uint goalAmount,
        uint deadlineBlocksNum);

    /**
        @dev Function to get all projects
     */
    function getAllProjects external view returns (ProjectStandard[] memory) {
        return projects;
    }

    /**
        @dev Function to create a new Project
        @param receiver Reveiver of the new Project
        @param title Title of the funding project
        @param desc Desc of the funding project
        @param goalAmount Funding target
        @param deadlineBlocksNum Deadline condition of project
     */
    function createProject(
        address receiver,
        // calldata read-only
        string calldata title, 
        string calldata desc, 
        uint256 goalAmount,
        uint256 deadlineBlocksNum) external {
        ProjectStandard project = new ProjectStandard(msg.sender, receiver, title, desc, goalAmount, deadlineBlockNum);
        projects.push(project);
        emit NewProject(
            address(project),
            msg.sender,
            receiver,
            title,
            desc,
            goalAmount,
            deadlineBlocksNum);
    }
}

abstract contract Project{

    // state stores all the infomation about for a project
    struct State{
        address owner;
        address receiver;
        string title;
        string description;
        uint256 balance;
        uint256 goal_amount;
        uint256 blocks_num;
        //TODO: maybe change deadline to a string with a physical clock? 
        // From a user's perspective, using physical clock makes more sense.
        uint256 deadline_blocks_num; 
        mapping(address => uint256) contribution;
        address[] funders;
        bool active;
    }
    State public state;

    function contribute() public virtual payable returns(bool);
    function changeDeadline(uint256) public virtual returns(bool);
    function completeProject() public virtual returns(bool);
    function cancelProject() public virtual returns(bool);
    function getCurrentState() public virtual;


}

contract ProjectStandard is Project{

    event stateInfo(address, address, string,  string, uint256, uint256, uint256, uint256, address[]);
    event fundingRecevied(address, uint256, uint256);
    event projectCompleted(address, address, uint256);
    event projectCanceled(address, address, uint256);

    constructor(address owner, 
               address receiver, 
               string memory title, 
               string memory description,
               uint256 goal_amount,
               uint256 deadline_blocks_num) {
        state.owner = owner;
        state.receiver = receiver;
        state.title = title;
        state.description = description;
        state.goal_amount = goal_amount;
        state.deadline_blocks_num = deadline_blocks_num;
        state.balance = 0;
        state.blocks_num = 0;
        state.active = true;
    }

    function contribute() public override payable returns(bool){
        require(state.active, "This project is not active!");
        state.balance += msg.value;
        
        // record the funder if it's the first time contribute this project
        if(state.contribution[msg.sender] == 0){
            state.funders.push(msg.sender);
        }

        state.contribution[msg.sender] += msg.value;
        emit fundingRecevied(msg.sender, msg.value, state.balance);
        return true;
    }

    function completeProject() public override returns(bool){
        require(state.active, "This project is no longer active!");
        payable(state.receiver).transfer(address(this).balance);
        state.active = false;
        emit projectCompleted(state.owner, state.receiver, state.balance);
        return true;
    }

    function cancelProject() public override returns(bool){
        require(state.active, "This project is no longer active!");
        for(uint i = 0; i < state.funders.length; i++){
            address funder = state.funders[i];
            uint256 contribution = state.contribution[funder];
            // refund the contribution
            payable(funder).transfer(contribution);
            state.balance -= contribution;
        }
        state.active = false;
        emit projectCanceled(state.owner, state.receiver, state.balance);
        return true;
    }

    function changeDeadline(uint256) public override returns(bool){
        return true;
    }

    // TODO change it events
    function getCurrentState() public override {
        emit stateInfo(state.owner,
                state.receiver,
                state.title,
                state.description,
                state.balance,
                state.goal_amount,
                state.blocks_num,
                state.deadline_blocks_num,
                state.funders);
    }

}