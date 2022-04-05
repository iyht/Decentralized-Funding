import { List } from "antd";
import { ProjectCard } from "./project-card";

export const ProjectList = ({ projects }) => {
  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={projects}
      renderItem={(project) => (
        <List.Item>
          <ProjectCard project={project} />
        </List.Item>
      )}
    />
  );
};
