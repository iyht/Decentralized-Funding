import "./App.css";
import { useState } from "react";
import { Layout, Menu } from "antd";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import UBClogo from "./ubc-logo.png";
import { CreateProject } from "./components/create-project";
import { Dashboard } from "./components/dashboard";
import { ProjectsBoard } from "./components/projects-board";
import { SearchProject } from "./components/search-project";
import MyWallet from "./components/wallet/MyWallet";

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
  const [currentMenuItem, setCurrentMenuItem] = useState(
    window.location.pathname
  );

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
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 380 }}
            >
              <Routes>
                <Route exact path="/" element={<SearchProject />} />
                <Route exact path="/projects" element={<ProjectsBoard />} />
                <Route
                  path="/projects/search/:keyword/"
                  element={<ProjectsBoard />}
                />
                <Route
                  exact
                  path="/create-project"
                  element={<CreateProject />}
                />
                <Route exact path="/dashboard" element={<Dashboard />} />
                <Route exact path="/wallet" element={<MyWallet />} />
              </Routes>
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
  );
}

export default App;
