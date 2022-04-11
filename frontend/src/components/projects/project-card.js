import { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import _ from "lodash";
import { Button, Card, Modal, Tooltip, Progress, message, Result } from "antd";
import { FaHandsHelping } from "react-icons/fa";
import { IoTicketSharp } from "react-icons/io5";
import { MdDownloadDone, MdDeleteOutline } from "react-icons/md";

import { ProjectInfo, ProjectLotteryInfo } from "../config/artifacts";
import { ContributeProject } from "../contribute/contribute-project";
import { ContractContext } from "../utils/contract_context";

const { Meta } = Card;

export const ProjectCard = ({ projectAddress, isDashboard }) => {
  const { provider, signer } = useContext(ContractContext);
  const [signerAddress, setSignerAddress] = useState("");
  const [project, setProject] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [goalAmount, setGoalAmount] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [category, setCategory] = useState("standard");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [winner, setWinner] = useState("");
  const [prize, setPrize] = useState(0);

  useEffect(() => {
    if (!projectAddress) {
      return;
    }

    async function getProject() {
      await provider.send("eth_requestAccounts", []);
      const _signerAddress = await signer.getAddress();
      if (_signerAddress !== signerAddress) {
        setSignerAddress(_signerAddress);
      }
      let _project = new ethers.Contract(
        projectAddress,
        ProjectInfo.abi,
        signer
      );
      _project.category().then((_category) => {
        if (_category === "lottery") {
          _project = new ethers.Contract(
            projectAddress,
            ProjectLotteryInfo.abi,
            signer
          );
        }
        if (_project.address !== project.address) {
          setProject(_project);
        }
      });
    }
    getProject();
  }, [projectAddress, signerAddress, project]);

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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const showResult = () => {
    setIsResultVisible(true);
  };

  const handleResultOk = () => {
    setIsResultVisible(false);
  };

  const handleResultCancel = () => {
    setIsResultVisible(false);
  };

  const handleDeleteProject = () => {
    project.cancelProject().then(() => message.success("Project deleted!"));
  };

  const handleCompleteProject = () => {
    if (category === "lottery") {
      console.log("preparing to complete lottery project...");

      project.on("projectCompleted", (owner, receiver, amount) => {
        console.log({ receiver, amount });
        setWinner(receiver);
        setPrize(amount);
      });
      project.completeProject().then(() => showResult());
    } else {
      project
        .completeProject()
        .then(() => message.success("Project completed!"));
    }
  };

  const handleClickBackHome = () => {
    window.location.href = "/";
  };

  return (
    <div>
      <Card
        style={{ width: 300 }}
        cover={
          <img
            alt={"cover image"}
            src={imgUrl}
            style={{
              width: 300,
              height: 220,
              objectFit: "scale-down",
            }}
          />
        }
        actions={
          isDashboard
            ? [
                <MdDeleteOutline onClick={handleDeleteProject} />,
                <MdDownloadDone onClick={handleCompleteProject} />,
              ]
            : []
        }
      >
        <Meta
          title={title}
          description={
            <div>
              <div>
                by {signerAddress.substring(0, 6)}...
                {signerAddress.substring(signerAddress.length - 4)}
              </div>
              <div>
                open on {new Date(timestamp * 1000).toLocaleDateString("en-US")}
              </div>
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
                style={{ width: "80%" }}
              />
            </div>
          }
          avatar={
            <Tooltip placement="bottom" title="Click to contribute">
              {category === "standard" ? (
                <FaHandsHelping color="#eb2f96" size="32" onClick={showModal} />
              ) : (
                <IoTicketSharp color="#eb2f96" size="32" onClick={showModal} />
              )}
            </Tooltip>
          }
        />
      </Card>
      <Modal
        title="Contribute"
        width={"80%"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <ContributeProject
          project={project}
          title={title}
          description={description}
          imgUrl={imgUrl}
          amount={amount}
          goalAmount={goalAmount}
          timestamp={timestamp}
          duration={duration}
          category={category}
        />
      </Modal>

      <Modal
        title="Lottery Result"
        width={"80%"}
        visible={isResultVisible}
        onOk={handleResultOk}
        onCancel={handleResultCancel}
      >
        <Result
          status="success"
          title="Prize Drew!"
          subTitle={`The winner address is ${winner}. ${prize}ETH has been transfered to the winner.`}
          extra={[
            <Button
              type="primary"
              key="back-home"
              onClick={handleClickBackHome}
            >
              Back to home page
            </Button>,
          ]}
        />
      </Modal>
    </div>
  );
};
