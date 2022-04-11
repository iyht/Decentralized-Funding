import { useState, useEffect } from "react";
import { ethers } from "ethers";
import _ from "lodash";
import {
  Button,
  InputNumber,
  Image,
  Progress,
  Statistic,
  Typography,
  Row,
  Col,
  Space,
} from "antd";
import { DollarOutlined } from "@ant-design/icons";
import { FaHandsHelping } from "react-icons/fa";
import { IoTicketSharp } from "react-icons/io5";
import { FcExpired } from "react-icons/fc";

const { Title, Text } = Typography;
const { Countdown } = Statistic;

export const ContributeProject = ({
  project,
  title,
  description,
  imgUrl,
  amount,
  goalAmount,
  timestamp,
  duration,
  category,
}) => {
  const [provider, setProvider] = useState(
    new ethers.providers.Web3Provider(window.ethereum, "any")
  );
  const [remainTime, setRemainTime] = useState(0);
  const [blockTime, setBlockTime] = useState(0);
  const [contributeAmount, setContributeAmount] = useState(0);

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

        if (block.timestamp !== blockTime) {
          setBlockTime(block.timestamp);
        }
      });
    });
  }, [provider, timestamp, duration, remainTime, blockTime]);

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
      <Title>
        {title}{" "}
        {category === "standard" ? (
          <FaHandsHelping color="#eb2f96" size="32" />
        ) : (
          <IoTicketSharp color="#096dd9" size="32" />
        )}
      </Title>
      <Row>
        <Col span={12}>
          <Image width={360} src={imgUrl} />
          <div style={{ marginTop: 24 }}>
            <Text>{description}</Text>
          </div>
        </Col>
        <Col span={12}>
          {remainTime - blockTime < 0 ? (
            <Title level={3}>
              <FcExpired /> Project has expired
            </Title>
          ) : (
            <Countdown
              title="Countdown"
              value={remainTime}
              format="D day H hr"
            />
          )}

          <div style={{ marginTop: 48, width: "80%" }}>
            <div>target of {ethers.utils.formatEther(goalAmount)} ETH</div>
            <Progress
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              percent={(
                (100 * ethers.utils.formatEther(amount)) /
                ethers.utils.formatEther(goalAmount)
              ).toFixed(2)}
            />
          </div>

          <Space style={{ marginTop: 48 }}>
            <InputNumber
              defaultValue={0.001}
              addonAfter={"ETH"}
              onChange={onAmountChange}
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              icon={<DollarOutlined />}
              onClick={handleClickTransfer}
            >
              Transfer
            </Button>
          </Space>
          <div style={{ marginTop: 8 }}>
            {category === "lottery" ? (
              <Text style={{ color: "grey" }}>
                Note: you need to pay at least 0.05ETH to participate this
                lottery
              </Text>
            ) : (
              ""
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};
