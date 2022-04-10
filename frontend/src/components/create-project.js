import { useWeb3React } from '@web3-react/core';
import React, {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import {
  Typography,
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
} from 'antd';

import { Contract, ethers, Signer } from 'ethers';
import { ManagerInfo } from "./config/artifacts";


const { Title } = Typography;


const ProjectForm = () => {


  const [form] = Form.useForm()

  const onFinish = async () => {
    // get provider info from the the wallet. The wallet should be connected to the ropsten already.
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    let userAddress = await signer.getAddress();
    
    // get the contract instance
    const manager = new ethers.Contract(ManagerInfo.address, ManagerInfo.abi, signer);


    // prep args for creating the project
    const receiver_addr = userAddress;
    const title = form.getFieldValue('title');
    const description = form.getFieldValue('description');
    const img_url = "www.hualahuala.com/image1"; // TODO find a way to store the image and pass the img url
    const goal_amount = ethers.utils.parseEther(String(form.getFieldValue('goal_amount')));
    const duration = 3;  // TODO replace duartion with due_date
    const due_date = String(form.getFieldValue('due_date'));

    console.log("receiver_addr", receiver_addr);
    console.log("title", title);
    console.log("description", description);
    console.log("img_url", img_url);
    console.log("goal_amount", goal_amount);
    console.log("duration", duration);
    console.log("due_date", due_date);

    manager.on("NewStandardProject", (
      sender,
      receiver,
      title,
      desc,
      imgUrl,
      goalAmount,
      duration, event) => { // callback function is we recv the "NewStandardProject" event
      console.log("received event");
      console.log(sender, receiver, title, desc, imgUrl, goalAmount, duration, event);
    });
    // create the project
    await manager.createProject(receiver_addr, title, description, img_url, goal_amount, duration);

    // call contract to get all the projects
    let allProjects = await manager.getAllProjects();
    console.log("allProjects", allProjects);
  }


  return ( 
      <Form 
      form={form}
      name="Project"
      onFinish={onFinish}
       >
        <Form.Item name="title" label="Title" rules={[ { required: true }, ]} >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[ { required: true }, ]} >
          <Input />
        </Form.Item>
        <Form.Item name="goal_amount" label="Goal Amount" rules={[ { required: true }, ]} >
          <InputNumber/>
        </Form.Item>
        <Form.Item label="Due Date" name="due_date">
          <DatePicker />
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item> 
      </Form>)
    
};



export const CreateProject = () => {

  return (
    <div>
      <Title level={2}>Create your project now</Title>
      <ProjectForm/>
    </div>
  );
};
