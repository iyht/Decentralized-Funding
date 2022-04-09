import { useState } from "react";
import { ethers } from "ethers";
import {
  Button,
  InputNumber,
  Image,
  Progress,
  Statistic,
  Typography,
} from "antd";

const { Title, Text } = Typography;
const { Countdown } = Statistic;

export const ContributeProject = ({ project }) => {
  const [provider, setProvider] = useState(
    new ethers.providers.Web3Provider(window.ethereum, "any")
  );
  const [amount, setAmount] = useState(0);

  const getRemainingTime = async () => {
    const blockNumber = await provider.getBlockNumber();
    const currentTime = await provider.getBlock(blockNumber).timestamp;
    return (
      project.timestamp() + project.duration() * 24 * 60 * 60 - currentTime
    );
  };

  const onAmountChange = (value) => {
    setAmount(value);
  };

  const handleClickTransfer = () => {
    project.contribute();
  };

  return (
    <div>
      <Title>{project.title()}</Title>
      <Image width={"20%"} src={project.img_url()} />
      <Text>{project.description()}</Text>

      <Countdown
        title="Countdown"
        value={getRemainingTime()}
        format="D days H hrs"
      />

      <InputNumber
        value={amount}
        prefix="$"
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        onChange={onAmountChange}
      />
      <Button type="primary" onClick={handleClickTransfer}>
        Transfer
      </Button>

      <Progress
        strokeColor={{
          "0%": "#108ee9",
          "100%": "#87d068",
        }}
        percent={project.amount() / project.goal_amount()}
      />
    </div>
  );
};
