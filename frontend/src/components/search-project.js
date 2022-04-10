import { useState, useEffect, useContext } from "react";
import { Button, Input } from "antd";
import { Contract, ethers, Signer } from "ethers";
import _ from "lodash";

import { ManagerInfo, ProjectInfo } from "./config/artifacts";
import { ProjectList } from "./projects/project-list";

const { Search } = Input;

export const SearchProject = ({}) => {
  const [signer, setSigner] = useState();
  const [projectsAddress, setProjectsAddress] = useState([]);
  const [projectContracts, setProjectContracts] = useState([]);
  const [titles, setTitles] = useState([]);
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

    if (projectContracts.address !== _projectContracts.address) {
      setProjectContracts(_projectContracts);
    }
  }, [projectsAddress, projectContracts]);

  useEffect(() => {
    if (!projectContracts || projectContracts.length === 0) {
      return;
    }

    async function getProjectTitles() {
      for (let index = 0; index < projectContracts.length; index++) {
        const contract = projectContracts[index];
        const title = await contract.title();
        titles.push(title);
        console.log({ title, titles });
        setTitles(titles);
      }
    }

    getProjectTitles();
  }, [projectContracts, titles]);

  const searchResult = (query) => {
    console.log({ query, titles });
    return [];
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
      {options.length > 0 ? <ProjectList projects={options} /> : ""}
    </div>
  );
};
