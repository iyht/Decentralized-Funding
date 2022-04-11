import { Card, Modal } from "antd";
import { ethers } from "ethers";
import { ProjectInfo } from "../config/artifacts";
import { useEffect, useState } from "react";
import Icon, { HomeOutlined } from "@ant-design/icons";
import { DollarTwoTone, HeartTwoTone } from "@ant-design/icons";
import { Space } from "antd";
import _ from "lodash";

import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ContributeProject } from "../contribute/contribute-project";

const { Meta } = Card;

export const ProjectCard = ({ projectAddress }) => {
  const [project, setProject] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [category, setCategory] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!projectAddress) {
      return;
    }

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
      if (_project.address !== project.address) {
        setProject(_project);
      }
    }
    getProject();
  }, [projectAddress, project]);

  useEffect(() => {
    if (_.isEmpty(project)) {
      return;
    }
    project.title().then((_title) => {
      if (_title !== title) {
        setTitle(_title);
      }
    });
    project.description().then((_description) => {
      if (_description !== description) {
        setDescription(_description);
      }
    });
    project.img_url().then((_imgUrl) => {
      if (_imgUrl !== imgUrl) {
        setImgUrl(_imgUrl);
      }
    });
    project.goal_amount().then((_goalAmount) => {
      if (!_.isEqual(_goalAmount, goalAmount)) {
        setGoalAmount(_goalAmount);
      }
    });
    project.duration().then((_duration) => {
      if (!_.isEqual(_duration, duration)) {
        setDuration(_duration);
      }
    });
    project.category().then((_category) => {
      if (_category !== category) {
        setCategory(_category);
      }
    });
  }, [project, title, description, imgUrl, goalAmount, duration, category]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Card
        style={{ width: 300 }}
        cover={
          <img
            alt={""}
            src={
              "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            }
          />
        }
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Meta
          title={title}
          description={
            "Goal Amount is " + goalAmount + ", the duration day is " + duration
          }
          avatar={
            category === "standard" ? (
              <HeartTwoTone
                twoToneColor="#eb2f96"
                style={{ fontSize: "32px" }}
                onClick={showModal}
              />
            ) : (
              <DollarTwoTone
                twoToneColor="#eb2f96"
                style={{ fontSize: "32px" }}
                onClick={showModal}
              />
            )
          }
        />
      </Card>
      <Modal
        title="Contribute"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ContributeProject project={project} />
      </Modal>
    </div>
  );
};
