import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import _ from "lodash";

import { ProjectList } from "./projects/project-list";
import { ContractContext } from "./utils/contract_context";
import { ProjectContext } from "./utils/project_context";

export const ProjectsBoard = ({}) => {
  const { projects, setProjects} = useContext(ProjectContext);
  const [projectContracts, setprojectContracts] = useState([]);
  const [projectsAddress, setprojectsAddress] = useState([]);
  useEffect( () => {
    setprojectContracts(projects.map((p) => {
      return p.contract;
    }));

    setprojectsAddress(projects.map((p) =>{
      return p.contractAddr;
    }));
    console.log("hu", projectContracts);
    console.log("proj in page", projects);
  }, [projects])

  return <ProjectList projects={projectsAddress} />;
};
