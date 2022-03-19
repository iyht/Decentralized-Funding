// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract Manager{

    Project[] public projects;

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
    function getAllProjects external view returns (Project[] memory) {
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
        Project project = new ProjectStandard(msg.sender, receiver, title, desc, goalAmount, deadlineBlockNum);
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
        string img_url;
        uint256 amount;
        uint256 goal_amount;
        uint blocks_num;
        //TODO: maybe change deadline to a string with a physical clock? 
        // From a user's perspective, using physical clock makes more sense.
        uint deadline; 
        mapping(address => uint256) contribution;
        address[] funders;
        bool active;
    }
    State public state;

    modifier ensure() {
        require(state.deadline >= block.timestamp, "This project is expired!");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == state.owner, "Permission denied.");
        _;
    }

    modifier active() {
        require(state.active, "This project is not active!");
        _;
    }

    function contribute() public virtual payable returns(bool);
    function changeDeadline(uint) public virtual returns(bool);
    function completeProject() public virtual returns(bool);
    function cancelProject() public virtual returns(bool);
    function getCurrentState() public virtual;


}

contract ProjectStandard is Project{

    event stateInfo(address indexed, address indexed, string, string, string, uint256, uint256, uint256, uint, uint, address[]);
    event fundingRecevied(address indexed, uint256, uint256);
    event projectCompleted(address indexed, address indexed, uint256);
    event projectCanceled(address indexed, address indexed, uint256);

    constructor(address owner, 
               address receiver, 
               string memory title, 
               string memory description,
               string memory img_url,
               uint256 goal_amount,
               uint deadline_blocks_num) {
        state.owner = owner;
        state.receiver = receiver;
        state.title = title;
        state.description = description;
        state.img_url = img_url;
        state.goal_amount = goal_amount;
        state.deadline = deadline_blocks_num;
        state.amount = 0;
        state.blocks_num = block.timestamp;
        state.active = true;
    }

    function contribute() public active ensure override payable returns(bool){
        state.amount += msg.value;
        
        // record the funder if it's the first time contribute this project
        if(state.contribution[msg.sender] == 0){
            state.funders.push(msg.sender);
        }

        state.contribution[msg.sender] += msg.value;
        emit fundingRecevied(msg.sender, msg.value, address(this).balance);
        return true;
    }

    function completeProject() public active onlyOwner override returns(bool){
        payable(state.receiver).transfer(address(this).balance);
        state.active = false;
        emit projectCompleted(state.owner, state.receiver, address(this).balance);
        return true;
    }

    function cancelProject() public active onlyOwner override returns(bool){
        for(uint i = 0; i < state.funders.length; i++){
            address funder = state.funders[i];
            uint256 contribution = state.contribution[funder];
            // refund the contribution
            payable(funder).transfer(contribution);
        }
        state.active = false;
        emit projectCanceled(state.owner, state.receiver, address(this).balance);
        return true;
    }

    function changeDeadline(uint _deadline) public ensure active onlyOwner override returns(bool){
        require(_deadline > state.deadline, "New deadline should be later than old deadline.");
        state.deadline = _deadline;
        return true;
    }

    // TODO change it events
    function getCurrentState() public override {
        emit stateInfo(state.owner,
                state.receiver,
                state.title,
                state.description,
                state.img_url,
                state.amount,
                state.goal_amount,
                address(this).balance,
                state.blocks_num,
                state.deadline,
                state.funders);
    }

}