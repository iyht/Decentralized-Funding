// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract Manager{

    Project[] private projects;

    event NewProject(
        //address contractAddr,
        address owner,
        address receiver,
        string title,
        string description,
        string img_url,
        uint goalAmount,
        uint deadlineBlocksNum);

    /**
        @dev Function to get all projects
     */
    function getAllProjects () external view returns (Project[] memory) {
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
        string calldata imgUrl,
        uint256 goalAmount,
        uint256 deadlineBlocksNum) external {
        Project project = new ProjectStandard(msg.sender, receiver, title, desc, imgUrl, goalAmount, deadlineBlocksNum);
        projects.push(project);
        emit NewProject(
           // address(project),
            msg.sender,
            receiver,
            title,
            desc,
            imgUrl,
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
        uint timestamp;
        //TODO: maybe change deadline to a string with a physical clock? 
        // From a user's perspective, using physical clock makes more sense.
        uint duration; 
        mapping(address => uint256) contribution;
        address[] funders;
        bool active;
    }
    State public state;

    modifier ensure() {
        require(state.timestamp + state.duration * 1 days >= block.timestamp, "This project is expired!");
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
    function changeDuration(uint) public virtual returns(bool);
    function completeProject() public virtual returns(bool);
    function cancelProject() public virtual returns(bool);
    function getCurrentState() public virtual;


}

contract ProjectStandard is Project{

    event stateInfo(address indexed, address indexed, string, string, string, uint256, uint256, uint256, uint, uint, address[]);
    event fundingRecevied(address indexed, uint256, uint256);
    event projectCompleted(address indexed, address indexed, uint256);
    event projectCanceled(address indexed, address indexed, uint256);
    event durationChanged(uint, uint);

    constructor(address _owner, 
               address _receiver, 
               string memory _title, 
               string memory _description,
               string memory _img_url,
               uint256 _goal_amount,
               uint _duration) {
        state.owner = _owner;
        state.receiver = _receiver;
        state.title = _title;
        state.description = _description;
        state.img_url = _img_url;
        state.goal_amount = _goal_amount;
        state.duration = _duration;
        state.amount = 0;
        state.timestamp = block.timestamp;
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

    function changeDuration(uint _duration) public ensure active onlyOwner override returns(bool){
        require(_duration > state.duration, "Project duration can only be extended.");
        require(address(this).balance < state.goal_amount, "project duration cannot be extended once the funding goal is reached.");
        state.duration = _duration;
        emit durationChanged(state.timestamp, state.duration);
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
                state.timestamp,
                state.duration,
                state.funders);
    }

}