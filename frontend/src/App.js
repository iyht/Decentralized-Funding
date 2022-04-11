import "./App.css";
import { useState, createContext, useEffect } from "react";
import { Layout, Menu } from "antd";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import UBClogo from "./ubc-logo.png";
import { NavRoutes } from "./components/routes";
import MyWallet from "./components/wallet/MyWallet";
import { Contract, ethers, Signer } from 'ethers';
import { ManagerInfo } from "./components/config/artifacts";
import { ContractContext } from "./components/utils/contract_context";
import lib from "@ant-design/icons";
import { useWeb3React } from "@web3-react/core";


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



function App() {
  const { chainId, library } = useWeb3React();
  const [manager, setManager] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [currentMenuItem, setCurrentMenuItem] = useState(
    window.location.pathname
  );

  let _provider, _signer, _manager;
  const init = async () => {
    // get provider info from the the wallet. The wallet should be connected to the ropsten already.
    _provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await _provider.send("eth_requestAccounts", []);
    _signer = _provider.getSigner();
    // get the contract instance
    _manager = new ethers.Contract(ManagerInfo.address, ManagerInfo.abi, _signer);
    setManager(_manager);
    setProvider(_provider);
    setSigner(_signer);
    console.log("pr", provider);
    console.log("si", signer);
    console.log("ma", manager);
  };

  useEffect(() => {
		init();
	}, [library]);


  const handleClickMenuItem = (e) => {
    setCurrentMenuItem(e.key);
  };

  return (
    <ContractContext.Provider value={{manager, provider, signer, setManager, setProvider, setSigner}}>
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
      </Router>
    </div>
    </ContractContext.Provider>
  );
}

export default App;
