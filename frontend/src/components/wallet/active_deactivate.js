import { injected } from "./connecter";
import { useState } from "react";
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { Button } from "antd";

function Activate() {
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

function Deactivate(){
    const context = useWeb3React();
    const { deactivate, active } = context;
  
    function handleDeactivate(event){
      event.preventDefault();
      deactivate();
    }
  
    return (
      <Button
        disabled={!active}
        style={{
          cursor: active ? 'pointer' : 'not-allowed',
          borderColor: active ? 'red' : 'unset'
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

function getErrorMessage(error){
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

export function ActivateDeactivate(){
    const context = useWeb3React();
    const { error } = context;
  
    if (!!error) {
      window.alert(getErrorMessage(error));
    }
  
    return (
        <div>
            <Activate />
            <Deactivate />
        </div>
    );
  }