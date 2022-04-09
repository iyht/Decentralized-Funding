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

import Manager from "../artifacts/contracts/Funding.sol/Manager.json";

const ManagerInfo = {
  address: "0xc9af75014a81188256172C2311EA38B2e6A0a223", // this is the address where the contract be deployed
  abi: Manager.abi
}


const { Title } = Typography;

const FormSizeDemo = () => {
  const [componentSize, setComponentSize] = useState('default');

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  return (
    <Form
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 14,
      }}
      layout="horizontal"
      initialValues={{
        size: componentSize,
      }}
      onValuesChange={onFormLayoutChange}
      size={componentSize}
    >
      <Form.Item label="Form Size" name="size">
        <Radio.Group>
          <Radio.Button value="small">Small</Radio.Button>
          <Radio.Button value="default">Default</Radio.Button>
          <Radio.Button value="large">Large</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Input">
        <Input />
      </Form.Item>
      <Form.Item label="Select">
        <Select>
          <Select.Option value="demo">Demo</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="TreeSelect">
        <TreeSelect
          treeData={[
            {
              title: 'Light',
              value: 'light',
              children: [
                {
                  title: 'Bamboo',
                  value: 'bamboo',
                },
              ],
            },
          ]}
        />
      </Form.Item>
      <Form.Item label="Cascader">
        <Cascader
          options={[
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [
                {
                  value: 'hangzhou',
                  label: 'Hangzhou',
                },
              ],
            },
          ]}
        />
      </Form.Item>
      <Form.Item label="DatePicker">
        <DatePicker />
      </Form.Item>
      <Form.Item label="InputNumber">
        <InputNumber />
      </Form.Item>
      <Form.Item label="Switch" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="Button">
        <Button>Button</Button>
      </Form.Item>
    </Form>
  );
};



export const CreateProject = ({}) => {
  const context = useWeb3React();
  const { library, active } = context;

  const [signer, setSigner] = useState();

  useEffect(() => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);
  console.log('lib', library);

  const create = async () => {

    // get provider info from the the wallet. The wallet should be connected to the ropsten already.
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    let userAddress = await signer.getAddress();

    // get the contract instance
    const manager = new ethers.Contract(ManagerInfo.address, ManagerInfo.abi, signer);

    console.log("manager", manager);
    console.log("abi", ManagerInfo.abi);

    // prep the args for create the project
    const receiver_addr = "";
    const title = "I'm Title";
    const description = "I'm Description";
    const img_url = "www.hualahuala.com/image1";
    const goal_amount = ethers.utils.parseEther("1.1");
    const deadline_blocks_num = 3;

    // add listener
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
    await manager.createProject(userAddress, title, description, img_url, goal_amount, deadline_blocks_num);

    // call contract to get all the projects
    let res = await manager.getAllProjects();
    console.log(res);
    console.log("end");
  }
  create();


  return (
    <div>
      <Title level={2}>Create your project now</Title>
      <FormSizeDemo/>
    </div>
  );
};
