import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import _ from "lodash";

import { ProjectList } from "./projects/project-list";
import { ContractContext } from "./utils/contract_context";

export const Dashboard = ({}) => {
  const [projects, setProjects] = useState([]);
  const { manager, provider, signer, setManager, setProvider, setSigner } = useContext(ContractContext);

  useEffect(() => {
    async function getManager() {
      const _projects = await manager.getAllProjects();
      if (!_.isEqual(projects, _projects)) {
        setProjects(_projects);
      }
    }
    getManager();
  }, [manager]);

  return <ProjectList projects={projects} />;
};
