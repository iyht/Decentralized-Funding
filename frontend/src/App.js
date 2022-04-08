import "./App.css";
import { useState, useEffect, createContext } from "react";
import { Layout, Menu } from "antd";
import { useWeb3React } from "@web3-react/core";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Web3 from "web3";

import UBClogo from "./ubc-logo.png";
import { NavRoutes } from "./components/routes";

import ManagerArtifact from "./artifacts/contracts/Funding.sol/Manager.json";

export const CONTACT_ADDRESS = "0xD3d1f12dC6a31Cd2b66CD10C6583fbF46D1bC701";

const { Header, Content, Footer } = Layout;

const pathname = {
  search: "/",
  projects: "/projects",
  searchProjects: "/projects/search/:keyword/",
  createProject: "/create-project",
  dashboard: "/dashboard",
  wallet: "/wallet",
};

const menuItemName = {
  search: "Search",
  projects: "Projects",
  dashboard: "My Dashboard",
  wallet: "My Wallet",
};

export const ContractContext = createContext({});

function App() {
  const [currentMenuItem, setCurrentMenuItem] = useState(
    window.location.pathname
  );
  const context = useWeb3React();
  const { account, library, active } = context;

  const [signer, setSigner] = useState();
  const [fundingContract, setFundingContract] = useState();
  const [fundingContractAddr, setFundingContractAddr] = useState("");

  useEffect(() => {
    // async function getWeb3Provider() {
    //   if (window.ethereum) {
    //     window.web3 = new Web3(window.ethereum);
    //     await window.ethereum.enable();
    //   } else if (window.web3) {
    //     window.web3 = new Web3(window.web3.currentProvider);
    //   } else {
    //     window.alert(
    //       "Non-Ethereum browser detected. You should consider trying MetaMask!"
    //     );
    //   }
    // }

    // async function load() {
    //   await getWeb3Provider();
    //   const accounts = await window.web3.eth.getAccounts();
    //   console.log("Attempting to deploy from account", accounts[0]);
    //   const myAccount = accounts[0];
    //   console.log(myAccount);
    //   // Instantiate smart contract using ABI and address.
    //   const ManagerContract = new window.web3.eth.Contract(
    //     ManagerArtifact.abi,
    //     CONTACT_ADDRESS
    //   );
    //   console.log({ ManagerContract });
    // }

    // load();

    if (typeof account === "undefined" || account === null || !library) {
      return;
    }

    console.log(account);
  }, [account]);

  // useEffect(() => {
  //   if (!library) {
  //     setSigner(undefined);
  //     return;
  //   }
  //   console.log(library.getSigner());
  //   setSigner(library.getSigner());
  // }, [library]);

  // const _contract = handleDeployContract(event, signer, fundingContract);
  // if (_contract !== fundingContract) {
  //   setFundingContract(_contract);
  //   console.log(_contract.getAllProjects());
  // }

  // useEffect(() => {
  //   if (!fundingContract) {
  //     return;
  //   }

  //   async function getFunding(fundingContract) {
  //     const _projects = await fundingContract.getAllProjects();

  //     if (_projects !== projects) {
  //       setGreeting(_projects);
  //     }
  //   }

  //   getFunding(fundingContract);
  // }, [fundingContract, projects]);

  const handleClickMenuItem = (e) => {
    setCurrentMenuItem(e.key);
  };

  return (
    <div className="App">
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
            <Menu
              theme="dark"
              mode="horizontal"
              onClick={handleClickMenuItem}
              selectedKeys={[currentMenuItem]}
            >
              {Object.entries(menuItemName).map(([page, name]) => (
                <Menu.Item key={pathname[page]}>
                  <a href={pathname[page]}>{name}</a>
                </Menu.Item>
              ))}
            </Menu>
          </Header>
          <Content
            className="site-layout"
            style={{ padding: "0 50px", marginTop: 64 }}
          >
            <ContractContext.Provider
              value={{ signer, setSigner, fundingContract, setFundingContract }}
            >
              <div
                className="site-layout-background"
                style={{ padding: 24, minHeight: 380 }}
              >
                <NavRoutes />
              </div>
            </ContractContext.Provider>
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
      </Router>
    </div>
  );
}

export default App;
