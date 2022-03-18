// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract Manager{

    Project[] private projects;
}

contract Project {

    struct State{
        address owner;
        address receiver_addr;
        string title;
        string description;
        uint256 amount;
        uint256 goal_amount;
        uint256 blocks_num;
        uint256 deadline_blocks_num;
        mapping(address => int) addr_to_amount;
        address[] sponser;
    }

    State public curr_state;


}

contract ProjectStandard is Project{

   constructor(address owner, 
               address receiver_addr, 
               string memory title, 
               string memory description,
               uint256 goal_amount,
               uint256 deadline_blocks_num) {
        curr_state.owner = owner;
        curr_state.receiver_addr = receiver_addr;
        curr_state.title = title;
        curr_state.description = description;
        curr_state.goal_amount = goal_amount;
        curr_state.deadline_blocks_num = deadline_blocks_num;
        curr_state.amount = 0;
        curr_state.blocks_num = 0;
    }

    function getCurrentState() public view returns(address, address, string memory, string memory, uint256, uint256, uint256, uint256, address[] memory) {
        return (curr_state.owner,
                curr_state.receiver_addr,
                curr_state.title,
                curr_state.description,
                curr_state.amount,
                curr_state.goal_amount,
                curr_state.blocks_num,
                curr_state.deadline_blocks_num,
                curr_state.sponser);
    }

}