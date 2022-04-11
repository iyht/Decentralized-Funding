import { ethers } from "ethers";
import { useEffect, useState } from "react";
import _ from "lodash";

import { ManagerInfo } from "./config/artifacts";
import { ProjectList } from "./projects/project-list";

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
      }
    }
    getManager();
  }, [projects]);

  return <ProjectList projects={projects} />;
};
