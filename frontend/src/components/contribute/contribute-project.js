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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [goalAmount, setGoalAmount] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [remainTime, setRemainTime] = useState(0);
  const [category, setCategory] = useState("");
  const [contributeAmount, setContributeAmount] = useState(0);

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
    project.amount().then((_amount) => {
      if (!_.isEqual(_amount, amount)) {
        setAmount(_amount);
      }
    });
    project.goal_amount().then((_goalAmount) => {
      if (!_.isEqual(_goalAmount, goalAmount)) {
        setGoalAmount(_goalAmount);
      }
    });
    project.timestamp().then((_timestamp) => {
      if (!_.isEqual(_timestamp, timestamp)) {
        setTimestamp(_timestamp);
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
  }, [
    project,
    title,
    description,
    imgUrl,
    amount,
    goalAmount,
    timestamp,
    duration,
    category,
  ]);

  useEffect(() => {
    if (timestamp === 0 || duration === 0) {
      return;
    }

    provider.getBlockNumber().then((blockNumber) => {
      provider.getBlock(blockNumber).then((block) => {
        const _remainTime =
          timestamp.toNumber() * 1000 +
          duration.toNumber() * 24 * 60 * 60 * 1000;

        if (_remainTime !== remainTime) {
          setRemainTime(_remainTime);
        }
      });
    });
  }, [provider, timestamp, duration, remainTime]);

  const onAmountChange = (value) => {
    setContributeAmount(value);
  };

  const handleClickTransfer = async () => {
    project.contribute({
      value: ethers.utils.parseEther(contributeAmount.toString()),
    });
  };

  return (
    <div>
      <Title>{title}</Title>
      <Image width={"20%"} src={imgUrl} />
      <Text>{description}</Text>

      <Countdown title="Countdown" value={remainTime} format="D day H hr" />

      <InputNumber
        defaultValue={0}
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
        percent={(amount / goalAmount).toFixed(2)}
      />
    </div>
  );
};
