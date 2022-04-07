import { useState, useEffect, useContext } from "react";
import { Button, Input } from "antd";
import { ContractContext } from "../App";

const { Search } = Input;

export const SearchProject = ({}) => {
  const { fundingContract } = useContext(ContractContext);
  const [projects, setProjects] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    console.log({ fundingContract });

    if (!fundingContract) {
      return;
    }

    async function getAllProjects(fundingContract) {
      const _projects = await fundingContract.getAllProjects();

      if (_projects !== projects) {
        setProjects(_projects);
      }
    }
  }, [fundingContract, projects]);

  const searchResult = (query) => {
    const filteredProjects = projects.filter((project, idx) =>
      project.title.includes(query)
    );
  };

  const onSearch = (value) => {
    setOptions(value ? searchResult(value) : []);
  };

  const handleClickCreateProject = () => {
    window.location.href = "/create-project";
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
    </div>
  );
};
