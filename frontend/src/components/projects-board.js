import { ethers, Signer, Wallet } from "ethers";
import { ProjectList } from "./projects/project-list";
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { ManagerInfo } from "./config/artifacts";
import _ from "lodash";

export const ProjectsBoard = ({}) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function getManager() {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const manager = new ethers.Contract(
        ManagerInfo.address,
        ManagerInfo.abi,
        signer
      );

      const _projects = await manager.getAllProjects();
      if (!_.isEqual(projects, _projects)) {
        setProjects(_projects);
        console.log(_projects);
      }
    }
    getManager();
  }, [projects]);
  console.log("projects log:" + projects);
  return <ProjectList projects={projects} />;
};