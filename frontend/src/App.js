import "./App.css";
import { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { BrowserRouter as HashRouter, Route, Routes } from "react-router-dom";
import _ from "lodash";
import { ethers } from "ethers";

import UBClogo from "./ubc-logo.png";
import { NavRoutes } from "./components/routes";
import MyWallet from "./components/wallet/MyWallet";
import { ManagerInfo, ProjectInfo } from "./components/config/artifacts";
import { ContractContext } from "./components/utils/contract_context";
import { Project, ProjectContext } from "./components/utils/project_context";
import { SearchProject } from "./components/search-project";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const SecondDomain = process.env.PUBLIC_URL;
export const pathname = {
  search: SecondDomain+"/",
  projects: SecondDomain+"/projects",
  searchProjects: SecondDomain+"/projects/search/:keyword/",
  createProject: SecondDomain+"/create-project",
  dashboard: SecondDomain+"/dashboard",
};

const menuItemName = {
  search: "Search",
  projects: "Projects",
  dashboard: "My Dashboard",
};

function App() {
  const [manager, setManager] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [projects, setProjects] = useState([]);
  const [projectsAddress, setProjectsAddress] = useState([]);
  const [currentMenuItem, setCurrentMenuItem] = useState(
    window.location.pathname
  );
  const navigate = useNavigate();
  useEffect(() => {
    const initManager = async () => {
      // get provider info from the the wallet. The wallet should be connected to the ropsten already.
      const _provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await _provider.send("eth_requestAccounts", []);
      const _signer = _provider.getSigner();
      // get the contract instance
      const _manager = new ethers.Contract(
        ManagerInfo.address,
        ManagerInfo.abi,
        _signer
      );

      if (!provider) {
        setProvider(_provider);
      }
      if (!signer) {
        setSigner(_signer);
      }
      if (manager?.address !== _manager.address) {
        setManager(_manager);
      }
    };
    initManager();
  }, [provider, manager, signer]);

  useEffect(() => {
    const initProjectsAddress = async () => {
      if (!manager) {
        return;
      }
      async function getManagerContract() {
        const _projectsAddress = await manager.getAllProjects();
        if (!_.isEqual(projectsAddress, _projectsAddress)) {
          setProjectsAddress(_projectsAddress);
        }
      }
      await getManagerContract();
    };
    initProjectsAddress();
  }, [manager, projectsAddress]);

  useEffect(() => {
    const initProjects = async () => {
      if (!projectsAddress || projectsAddress.length === 0) {
        return;
      }

      const _projects = [];
      const createProject = (address) => {
        const contract = new ethers.Contract(address, ProjectInfo.abi, signer);
        return contract.title().then((t) => {
          contract.owner().then((o) => {
            contract.active().then((a) => {
              if (a) {
                _projects.push(new Project(address, contract, t, o));
                setProjects([..._projects]);
              }
            });
          });
        });
      };

      projectsAddress.map(createProject);
    };
    initProjects();
  }, [projectsAddress, signer]);

  const handleClickMenuItem = (e) => {
    setCurrentMenuItem(e.key);
  };

  return (
    <ProjectContext.Provider value={{ projects, setProjects }}>
      <ContractContext.Provider
        value={{
          manager,
          provider,
          signer,
          setManager,
          setProvider,
          setSigner,
        }}
      >
        <div className="App">
            <Layout style={{ minHeight: "100vh" }}>
              <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
                <Menu
                  theme="dark"
                  mode="horizontal"
                  onClick={handleClickMenuItem}
                  selectedKeys={[currentMenuItem]}
                >
                  {/* {Object.entries(menuItemName).map(([page, name]) => (
                    <Menu.Item key={pathname[page]}>
                      <a href={pathname[page]}>{name}</a>
                    </Menu.Item>
                  ))} */}
                  <Menu.Item key="Search" onClick={() => {navigate("/")}}> Search </Menu.Item>
                  <Menu.Item key="Projects" onClick={() => {navigate("/projects")}}> Projects </Menu.Item>
                  <Menu.Item key="My Dashboard" onClick={() => {navigate("/dashboard")}}> My Dashboard </Menu.Item>
                </Menu>
              </Header>
              <Content
                className="site-layout"
                style={{ padding: "0 50px", marginTop: 64 }}
              >
                <div
                  className="site-layout-background"
                  style={{ padding: 24, minHeight: 380 }}
                >
                  <MyWallet />
                  <NavRoutes />
                </div>
              </Content>
              <Footer style={{ textAlign: "center" }}>
                <img
                  src={UBClogo}
                  alt="UBC Logo"
                  style={{ height: 30, width: 24, marginRight: 8 }}
                />
                EECE571G ©2022 Created by Haotian, Hanxin, Xuechun, Zhongze
              </Footer>
            </Layout>
        </div>
      </ContractContext.Provider>
    </ProjectContext.Provider>
  );
}

export default App;
