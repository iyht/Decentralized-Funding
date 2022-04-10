import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Button,
  InputNumber,
  Image,
  Progress,
  Statistic,
  Typography,
} from "antd";
import _ from "lodash";

const { Title, Text } = Typography;
const { Countdown } = Statistic;

export const ContributeProject = ({ project }) => {
  const [provider, setProvider] = useState(
    new ethers.providers.Web3Provider(window.ethereum, "any")
  );
  const [amount, setAmount] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal_amount, setGoal_amount] = useState(0);
  const [img_url, setImg_url] = useState("");
  const [duration, setDuration] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (_.isEmpty(project)) {
      return;
    }
    project.title().then((title) => setTitle(title));
    project.description().then((description) => setDescription(description));
    project.img_url().then((img_url) => setImg_url(img_url));
    project.goal_amount().then((goal_amount) => setGoal_amount(goal_amount));
    project.duration().then((duration) => setDuration(duration));
    project.category().then((category) => setCategory(category));
    project.timestamp().then((timestamp) => setTimestamp(timestamp));
  }, [project, title, description, img_url, goal_amount, duration, category]);

  const getRemainingTime = async () => {
    const blockNumber = await provider.getBlockNumber();
    const currentTime = await provider.getBlock(blockNumber).timestamp;
    return timestamp + duration * 24 * 60 * 60 - currentTime;
  };

  const onAmountChange = (value) => {
    setAmount(value);
  };

  const handleClickTransfer = () => {
    project.contribute();
  };

  return (
    <div>
      <Title>{title}</Title>
      <Image width={"20%"} src={img_url} />
      <Text>{description}</Text>

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
        percent={amount / goal_amount}
      />
    </div>
  );
};
