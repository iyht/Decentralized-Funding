import { useState, useContext } from "react";
import { Button, Input, Typography } from "antd";
import { ProjectList } from "./projects/project-list";
import { ProjectContext } from "./utils/project_context";
import { pathname } from "../App";

const { Search } = Input;
const { Title } = Typography;

export const SearchProject = () => {
  const { projects, setProjects } = useContext(ProjectContext);
  const [options, setOptions] = useState([]);

  const projectContracts = projects.map((p) => {
    return p.contract;
  });

  const projectsAddress = projects.map((p) => {
    return p.contractAddr;
  });

  const searchResult = async (query) => {
    const asyncFilter = async (projectContracts, predicate) => {
      const results = await Promise.all(projectContracts.map(predicate));

      return projectsAddress.filter((_v, index) => {
        return results[index];
      });
    };

    const filtered = await asyncFilter(projectContracts, async (contract) => {
      const title = await contract.title();
      return title.toLowerCase().includes(query.toLowerCase());
    });

    return filtered;
  };

  const onSearch = (value) => {
    searchResult(value).then((filtered) => {
      setOptions(value ? filtered : []);
    });
  };

  const handleClickCreateProject = () => {
    window.location.href = pathname.createProject;
  };

  return (
    <div>
      <Search
        placeholder="Search projects"
        onSearch={onSearch}
        enterButton
        style={{ width: "50%", marginTop: "30vh" }}
      />
      <div style={{ marginTop: "10vh" }}>
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={handleClickCreateProject}
        >
          Create New Project
        </Button>
      </div>

      {options.length > 0 ? (
        <div style={{ marginTop: 60 }}>
          <Title level={3}>Search Result ({options.length}): </Title>
          <ProjectList projects={options} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
