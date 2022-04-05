import { useState } from "react";
import { ProjectList } from "./projects/project-list";

export const ProjectsBoard = () => {
  const [projects, setProjects] = useState([]);

  return <ProjectList projects={projects} />;
};
