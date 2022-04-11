import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import _ from "lodash";

import { ProjectList } from "./projects/project-list";
import { ContractContext } from "./utils/contract_context";
import { ProjectContext } from "./utils/project_context";

export const ProjectsBoard = ({ }) => {

  const { projects, setProjects } = useContext(ProjectContext);
  const [projectsAddress, setprojectsAddress] = useState([]);
  useEffect(() => {
    setprojectsAddress(projects.map((p) => {
      return p.contractAddr;
    }));
  }, [projects])

  return <ProjectList projects={projectsAddress} />;
};
