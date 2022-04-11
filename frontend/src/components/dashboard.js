import { useContext, useEffect, useState } from "react";
import _ from "lodash";
import { Typography, Divider } from "antd";

import { ProjectList } from "./projects/project-list";
import { ContractContext } from "./utils/contract_context";
import { ProjectContext } from "./utils/project_context";

const { Title } = Typography;

export const Dashboard = () => {
  const { manager, signer } = useContext(ContractContext);
  const { projects, setProjects } = useContext(ProjectContext);
  const [projectsAddress, setprojectsAddress] = useState([]);
  const [fundedProjects, setFundedProjects] = useState([]);

  useEffect(() => {
    if (!signer) {
      return;
    }
    const tmp = [];
    signer.getAddress().then((userAddress) => {
      for (let i = 0; i < projects.length; i++) {
        if (projects[i].owner === userAddress) {
          tmp.push(projects[i].contractAddr);
        }
      }
      setprojectsAddress(tmp);
    });

    manager?.getMyFundedProjects().then((_fundedProjects) => {
      if (!_.isEqual(fundedProjects, _fundedProjects)) {
        setFundedProjects(_fundedProjects);
      }
    });
  }, [projects, signer, manager, fundedProjects]);

  return (
    <div>
      <Title level={2}>Owned Projects</Title>
      <ProjectList projects={projectsAddress} isDashboard={true} />
      <Divider />
      <Title level={2}>Funded Projects</Title>
      <ProjectList projects={fundedProjects} />
    </div>
  );
};
