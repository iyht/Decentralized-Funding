import { ethers } from 'ethers';
import { useEffect, useState } from "react";
import { ManagerInfo } from "./config/artifacts";
import { ProjectList } from "./projects/project-list";
import _ from "lodash";

export const Dashboard = ({}) => {
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
