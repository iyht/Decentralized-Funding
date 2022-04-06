import { injected } from "./connecter";
import { MouseEvent, ReactElement, useState } from 'react';
import {
    NoEthereumProviderError,
    UserRejectedRequestError
  } from '@web3-react/injected-connector';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';

function Activate(){
    const context = useWeb3React();
    const { activate, active } = context;
  
    const [activating, setActivating] = useState(false);
  
    function handleActivate(event){
      event.preventDefault();
  
      async function _activate(activate){
        setActivating(true);
        await activate(injected);
        setActivating(false);
      }
  
      _activate(activate);
    }

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has
    // granted access already
    // const eagerConnectionSuccessful = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider,
  // if it exists
//   useInactiveListener(!eagerConnectionSuccessful);

  return (
    <button
    //   disabled={active}
    //   style={{
    //     cursor: active ? 'not-allowed' : 'pointer',
    //     borderColor: activating ? 'orange' : active ? 'unset' : 'green'
    //   }}
      onClick={handleActivate}
    >
      Connecthhh
    </button>
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
        <Activate />
    );
  }