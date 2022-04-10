import Manager from "./../../artifacts/contracts/Funding.sol/Manager.json";
import Project from "./../../artifacts/contracts/Funding.sol/Project.json";
import ProjectLottery from "./../../artifacts/contracts/Funding.sol/ProjectLottery.json";
import ProjectStandard from "./../../artifacts/contracts/Funding.sol/ProjectStandard.json";

// this is the address where the contract be deployed
const CONTRACT_ADDRESS = "0xBdAA631296c897d9F1d800D1A5f9FC580CB8A5B5";

export const ManagerInfo = {
  address: CONTRACT_ADDRESS,
  abi: Manager.abi,
};

export const ProjectInfo = {
  address: CONTRACT_ADDRESS,
  abi: Project.abi,
};

export const ProjectStandardInfo = {
  address: CONTRACT_ADDRESS,
  abi: ProjectStandard.abi,
};

export const ProjectLotteryInfo = {
  address: CONTRACT_ADDRESS,
  abi: ProjectLottery.abi,
};
