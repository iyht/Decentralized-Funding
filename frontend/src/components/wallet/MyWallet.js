import { useState } from "react";
import { Affix, Button, Space, Popover } from "antd";
import { WalletTwoTone } from "@ant-design/icons";
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useEagerConnect, useInactiveListener } from "./hooks";
import { WalletStatus } from "./WalletState";
import { injected } from "./connectors";

function Connect() {
  const context = useWeb3React();
  const { activate, active } = context;

  const [activating, setActivating] = useState(false);

  function handleActivate(event) {
    event.preventDefault();

    async function _activate(activate) {
      setActivating(true);
      await activate(injected);
      setActivating(false);
    }

    _activate(activate);
  }
  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has
  // granted access already
  const eagerConnectionSuccessful = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider,
  // if it exists
  useInactiveListener(!eagerConnectionSuccessful);

  return (
    <Button
      disabled={active}
      style={{
        cursor: active ? "not-allowed" : "pointer",
        borderColor: activating ? "orange" : active ? "unset" : "green",
      }}
      type="primary"
      size="large"
      shape="round"
      onClick={handleActivate}
    >
      🦊 Connect
    </Button>
  );
}

function Disconnect() {
  const context = useWeb3React();
  const { deactivate, active } = context;

  function handleDeactivate(event) {
    event.preventDefault();
    deactivate();
  }

  return (
    <Button
      disabled={!active}
      style={{
        cursor: active ? "pointer" : "not-allowed",
      }}
      onClick={handleDeactivate}
      type="primary"
      size="large"
      shape="round"
    >
      Disconnect
    </Button>
  );
}

function getErrorMessage(error) {
  let errorMessage;

  switch (error.constructor) {
    case NoEthereumProviderError:
      errorMessage = `No Ethereum browser extension detected. Please install MetaMask extension.`;
      break;
    case UnsupportedChainIdError:
      errorMessage = `You're connected to an unsupported network.`;
      break;
    case UserRejectedRequestError:
      errorMessage = `Please authorize this website to access your Ethereum account.`;
      break;
    default:
      errorMessage = error.message;
  }

  return errorMessage;
}

export function ConnectionModule() {
  const context = useWeb3React();
  const { error } = context;

  if (!!error) {
    window.alert(getErrorMessage(error));
  }

  return (
    <Space style={{ marginTop: 24 }}>
      <Connect />
      <Disconnect />
    </Space>
  );
}

function MyWallet() {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = () => {
    setVisible(!visible);
  };

  return (
    <Affix style={{ position: "fixed", bottom: 60, right: 60 }}>
      <Popover
        content={
          <div>
            <WalletStatus />
            <ConnectionModule />
          </div>
        }
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <WalletTwoTone twoToneColor="#1890ff" style={{ fontSize: 36 }} />
      </Popover>
    </Affix>
  );
}

export default MyWallet;
