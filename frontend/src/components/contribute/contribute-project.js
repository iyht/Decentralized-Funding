import { useState, useEffect } from "react";
import { ethers } from "ethers";
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
import _ from "lodash";

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
      <Row>
        <Col span={12}>
          <Image width={360} src={imgUrl} />
          <div style={{ marginTop: 24 }}>
            <Text>{description}</Text>
          </div>
        </Col>
        <Col span={12}>
          <Countdown title="Countdown" value={remainTime} format="D day H hr" />

          <Progress
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
            percent={(
              (100 * ethers.utils.formatEther(amount)) /
              ethers.utils.formatEther(goalAmount)
            ).toFixed(2)}
            style={{ marginTop: 48, width: "80%" }}
          />

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
        </Col>
      </Row>
    </div>
  );
};
