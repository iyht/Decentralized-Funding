import { useState, useEffect } from "react";
import { Button, Input } from "antd";
import { ethers } from "ethers";
import _ from "lodash";

import { ManagerInfo, ProjectInfo } from "./config/artifacts";
import { ProjectList } from "./projects/project-list";

const { Search } = Input;

export const SearchProject = ({}) => {
  const [signer, setSigner] = useState();
  const [projectsAddress, setProjectsAddress] = useState([]);
  const [projectContracts, setProjectContracts] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function getManagerContract() {
      // get provider info from the the wallet. The wallet should be connected to the ropsten already.
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      setSigner(provider.getSigner());

      // get the contract instance
      const manager = new ethers.Contract(
        ManagerInfo.address,
        ManagerInfo.abi,
        provider.getSigner()
      );

      const _projectsAddress = await manager.getAllProjects();
      if (!_.isEqual(projectsAddress, _projectsAddress)) {
        setProjectsAddress(_projectsAddress);
      }
    }

    getManagerContract();
  }, [projectsAddress]);

  useEffect(() => {
    if (!projectsAddress || projectsAddress.length === 0) {
      return;
    }

    const _projectContracts = projectsAddress.map((address) => {
      return new ethers.Contract(address, ProjectInfo.abi, signer);
    });

    if (_projectContracts.length !== projectContracts.length) {
      setProjectContracts(_projectContracts);
    }
  }, [projectsAddress, projectContracts]);

  const searchResult = async (query) => {
    const asyncFilter = async (projectContracts, predicate) => {
      const results = await Promise.all(projectContracts.map(predicate));

      return projectsAddress.filter((_v, index) => {
        return results[index];
      });
    };

    const filtered = await asyncFilter(projectContracts, async (contract) => {
      const title = await contract.title();
      return title.includes(query);
    });

    return filtered;
  };

  const onSearch = (value) => {
    searchResult(value).then((filtered) => {
      setOptions(value ? filtered : []);
    });
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
      {options.length > 0 ? <ProjectList projects={options} /> : ""}
    </div>
  );
};
