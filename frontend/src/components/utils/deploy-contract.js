import { ethers } from "ethers";

import ManagerArtifact from "../../artifacts/contracts/Funding.sol/Manager.json";

export function handleDeployContract(event, signer, fundingContract) {
  event.preventDefault();

  // only deploy the contract one time, when a signer is defined
  if (fundingContract || !signer) {
    return;
  }

  async function deployfundingContract(signer) {
    const Funding = new ethers.ContractFactory(
      ManagerArtifact.abi,
      ManagerArtifact.bytecode,
      signer
    );

    try {
      const fundingContract = await Funding.deploy("Hello, Hardhat!");
      await fundingContract.deployed();
      window.alert(`Funding deployed to: ${fundingContract.address}`);
      return fundingContract;
    } catch (error) {
      window.alert(
        "Error!" + (error && error.message ? `\n\n${error.message}` : "")
      );
    }
  }

  return deployfundingContract(signer);
}
