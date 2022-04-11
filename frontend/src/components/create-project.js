import { useWeb3React } from '@web3-react/core';
import React, {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  Typography,
  Form,
  Input,
  Button,
  InputNumber,
  Switch,
  message,
  Upload,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { ethers } from "ethers";

import { ManagerInfo } from "./config/artifacts";
import { ContractContext } from './utils/contract_context';

const { Title } = Typography;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

class Avatar extends React.Component {
  state = {
    loading: false,
  };

  handleChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false,
        })
      );
    }
  };

  render() {
    const { loading, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="//jsonplaceholder.typicode.com/posts/"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
        ) : (
          uploadButton
        )}
      </Upload>
    );
  }
}

const ProjectForm = () => {
  const [form] = Form.useForm();
  const [lottery_check, setChecked] = React.useState(false);

  const loadProfile = () => {	
    form.setFieldsValue({
      percentage: 0,
      title: "<Replace with your project title>",
      description: "<Describe the usage of the funding>",
      duration: 1
    });
	}

  useEffect(() => {
		loadProfile();
	}, []);

  const { manager, provider, signer } = useContext(ContractContext);

  const onFinish = async () => {
    let userAddress = await signer.getAddress();

    // prep args for creating the project
    const receiver_addr = userAddress;
    const title = form.getFieldValue("title");
    const description = form.getFieldValue("description");
    const img_url = form.getFieldValue("img_url");
    const goal_amount = ethers.utils.parseEther(
      String(form.getFieldValue("goal_amount"))
    );
    const duration = form.getFieldValue("duration");
    const percentage = form.getFieldValue("percentage");

    manager.on(
      "NewStandardProject",
      (sender, receiver, title, desc, imgUrl, goalAmount, duration, event) => {
        // callback function is we recv the "NewStandardProject" event
        console.log("received event");
      }
    );

    // create the project
    if (lottery_check) {
      await manager.createLotteryProject(
        receiver_addr,
        title,
        description,
        img_url,
        goal_amount,
        duration,
        percentage
      );
      message.success("Project created!");
      window.location.href = "/projects";
    } else {
      await manager.createProject(
        receiver_addr,
        title,
        description,
        img_url,
        goal_amount,
        duration
      );
      message.success("Project created!");
      window.location.href = "/projects";
    }
  };

  return (
    <Form
      form={form}
      name="Project"
      layout="horizontal"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
    >
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input placeholder="Replace with your project title" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input placeholder="Describe the usage of the funding" />
      </Form.Item>
      <Form.Item
        name="img_url"
        label="Cover Image URL"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="goal_amount"
        label="Goal Amount"
        rules={[{ required: true }]}
      >
        <InputNumber addonAfter="ETH" />
      </Form.Item>
      <Form.Item name="duration" label="Duration" rules={[{ required: true }]}>
        <InputNumber addonAfter="days" />
      </Form.Item>
      <Form.Item name="lottery" label="Lottery Mode">
        <Switch checked={lottery_check} onChange={setChecked} />
      </Form.Item>
      <Form.Item
        name="percentage"
        label="Percentage for lottery"
        style={lottery_check !== true ? { display: "none" } : {}}
      >
        <InputNumber defaultValue={0} addonAfter="%" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export const CreateProject = () => {
  return (
    <div>
      <Title level={2}>Create your project now</Title>
      <ProjectForm />
    </div>
  );
};
