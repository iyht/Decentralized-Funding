import { useState, useEffect, useContext } from "react";
import { Button, Input } from "antd";
import { Contract, ethers, Signer } from "ethers";
import _ from "lodash";

import { ManagerInfo } from "./config/artifacts";
import { ProjectList } from "./projects/project-list";

const { Search } = Input;

export const SearchProject = ({}) => {
  const [projects, setProjects] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function getManager() {
      // get provider info from the the wallet. The wallet should be connected to the ropsten already.
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // get the contract instance
      const manager = new ethers.Contract(
        ManagerInfo.address,
        ManagerInfo.abi,
        signer
      );

      const _projects = await manager.getAllProjects();
      if (_.isEqual(projects, _projects)) {
        setProjects(_projects);
      }
    }

    getManager();
  }, [projects]);

  const searchResult = (query) => {
    return projects.filter((project, idx) => project.title.includes(query));
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
      <div>
        <ProjectList projects={options} />
      </div>
    </div>
  );
};
