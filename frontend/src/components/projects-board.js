import { useContext, useEffect, useState } from "react";
import _ from "lodash";
import { Typography } from "antd";

import { ProjectList } from "./projects/project-list";
import { ProjectContext } from "./utils/project_context";

const { Title } = Typography;

export const ProjectsBoard = ({}) => {
  const { projects, setProjects } = useContext(ProjectContext);
  const [projectsAddress, setprojectsAddress] = useState([]);
  useEffect(() => {
    setprojectsAddress(
      projects.map((p) => {
        return p.contractAddr;
      })
    );
  }, [projects]);

  return (
    <div>
      <Title level={2}>Project Board</Title>
      <ProjectList projects={projectsAddress} />
    </div>
  );
};
