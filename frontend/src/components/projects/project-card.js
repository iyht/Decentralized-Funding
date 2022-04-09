import { Card, Avatar } from "antd";
import { ethers, Signer, Wallet } from "ethers";
import { ProjectInfo } from "../config/artifacts"
import { useCallback, useEffect, useState } from 'react';
import _ from "lodash";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Meta } = Card;

export const ProjectCard = ({ projectAddress }) => {
  const [project, setProject] = useState();

  useEffect(() => {
    async function getProject() {

      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const _project = new ethers.Contract(
        projectAddress,
        ProjectInfo.abi,
        signer
      );
      if (_.isEqual(project, _project)) {
        setProject(_project);
      }
    }
    getProject();
  }, []);

  return (
    <Card
      style={{ width: 300 }}
      cover={
        <img
          alt="example"
          src={project.img_url()}
        />
      }
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Meta
        //avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
        title={project.title()}
        description={project.description()}
      />
    </Card>
  );
};
