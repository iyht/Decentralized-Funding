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
  message,
  Upload
} from 'antd';

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';



import { Contract, ethers, Signer } from 'ethers';
import { ManagerInfo } from "./config/artifacts";



const { Title } = Typography;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class Avatar extends React.Component {
  state = {
    loading: false,
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  LoadingOutlined

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
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}





const ProjectForm = () => {


  const [form] = Form.useForm()
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
    const duration = form.getFieldValue('duration');  
    const due_date = String(form.getFieldValue('due_date'));
    const percentage = form.getFieldValue('percentage')

    console.log("receiver_addr", receiver_addr);
    console.log("title", title);
    console.log("description", description);
    console.log("img_url", img_url);
    console.log("goal_amount", goal_amount);
    console.log("duration", duration);
    console.log("due_date", due_date);
    console.log("percentage", percentage);

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
    if(lottery_check){
      console.log("create lottery project");
      await manager.createLotteryProject(receiver_addr, title, description, img_url, goal_amount, duration, percentage);
    }else{
      console.log("create standard project");
      await manager.createProject(receiver_addr, title, description, img_url, goal_amount, duration);
    }

    // call contract to get all the projects
    let allProjects = await manager.getAllProjects();
    console.log("allProjects", allProjects);
  }


  return (
    <Form
      form={form}
      name="Project"
      layout="horizontal"
      onFinish={onFinish}
    >
      <Form.Item name="title" label="Title" rules={[{ required: true },]} >
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true },]} >
        <Input />
      </Form.Item>
      <Form.Item name="goal_amount" label="Goal Amount(ethers)" rules={[{ required: true },]} >
        <InputNumber />
      </Form.Item>
      <Form.Item name="duration" label="Duration(days)" rules={[{ required: true },]} >
        <InputNumber />
      </Form.Item>
      <Form.Item name="lottery" label="Lottery Mode">
        <Switch checked={lottery_check} onChange={setChecked} />
      </Form.Item>
      <Form.Item name="percentage" label="Percentage" style={lottery_check !== true ? { display: 'none'} : {}} >
        <InputNumber/>
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
      <ProjectForm />
    </div>
  );
};
