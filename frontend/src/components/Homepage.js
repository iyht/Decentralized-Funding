import { useState } from "react";
import { Layout, Menu } from "antd";
import { ProjectList } from "./projects/project-list";

const { Header, Content, Footer } = Layout;

export const Homepage = () => {
  const [projects, setProjects] = useState([]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">Projects</Menu.Item>
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
          <ProjectList projects={projects} />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        EECE571G ©2022 Created by Haotian, Hanxin, Xuechun, Zhongze
      </Footer>
    </Layout>
  );
};
