
import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Descriptions, Badge } from "antd";

function ChainId() {
  const { chainId } = useWeb3React();

  return <span>{chainId ?? ""}</span>;
}

function BlockNumber() {
  const { chainId, library } = useWeb3React();

  const [blockNumber, setBlockNumber] = useState();

  useEffect(() => {
    if (!library) {
      return;
    }

    let stale = false;

    async function getBlockNumber(library) {
      try {
        const blockNumber = await library.getBlockNumber();

        if (!stale) {
          setBlockNumber(blockNumber);
        }
      } catch (error) {
        if (!stale) {
          setBlockNumber(undefined);
        }

        window.alert(
          "Error!" + (error && error.message ? `\n\n${error.message}` : "")
        );
      }
    }

    getBlockNumber(library);

    library.on("block", setBlockNumber);

    // cleanup function
    return () => {
      stale = true;
      library.removeListener("block", setBlockNumber);
      setBlockNumber(undefined);
    };
  }, [library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return <span>{blockNumber === null ? "Error" : blockNumber ?? ""}</span>;
}

function Account() {
  const { account } = useWeb3React();

  return (
    <span>
      {typeof account === "undefined"
        ? ""
        : account
        ? `${account.substring(0, 6)}...${account.substring(
            account.length - 4
          )}`
        : ""}
    </span>
  );
}

function Balance() {
  const { account, library, chainId } = useWeb3React();

  const [balance, setBalance] = useState();

  useEffect(() => {
    if (typeof account === "undefined" || account === null || !library) {
      return;
    }

    let stale = false;

    async function getBalance(library, account) {
      const balance = await library.getBalance(account);

      try {
        if (!stale) {
          setBalance(balance);
        }
      } catch (error) {
        if (!stale) {
          setBalance(undefined);

          window.alert(
            "Error!" + (error && error.message ? `\n\n${error.message}` : "")
          );
        }
      }
    }

    getBalance(library, account);

    // create a named balancer handler function to fetch the balance each block. in the
    // cleanup function use the fucntion name to remove the listener
    const getBalanceHandler = () => {
      getBalance(library, account);
    };

    library.on("block", getBalanceHandler);

    // cleanup function
    return () => {
      stale = true;
      library.removeListener("block", getBalanceHandler);
      setBalance(undefined);
    };
  }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <span>
      {balance === null
        ? "Error"
        : balance
        ? `${Math.round(+ethers.utils.formatEther(balance) * 1e4) / 1e4} ETH`
        : ""}
    </span>
  );
}

// // nonce: aka 'transaction count'
function NextNonce() {
  const { account, library, chainId } = useWeb3React();

  const [nextNonce, setNextNonce] = useState();

  useEffect(() => {
    if (typeof account === "undefined" || account === null || !library) {
      return;
    }

    let stale = false;

    async function getNextNonce(library, account) {
      const nextNonce = await library.getTransactionCount(account);

      try {
        if (!stale) {
          setNextNonce(nextNonce);
        }
      } catch (error) {
        if (!stale) {
          setNextNonce(undefined);

          window.alert(
            "Error!" + (error && error.message ? `\n\n${error.message}` : "")
          );
        }
      }
    }

    getNextNonce(library, account);

    // create a named next nonce handler function to fetch the next nonce each block.
    // in the cleanup function use the fucntion name to remove the listener
    const getNextNonceHandler = () => {
      getNextNonce(library, account);
    };

    library.on("block", getNextNonceHandler);

    // cleanup function
    return () => {
      stale = true;
      setNextNonce(undefined);
    };
  }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return <span>{nextNonce === null ? "Error" : nextNonce ?? ""}</span>;
}

function StatusIcon() {
  const { active, error } = useWeb3React();

  return (
    <span>
      {active ? (
        <Badge status="success" text="Connected" />
      ) : error ? (
        <Badge status="error" text="Error" />
      ) : (
        <Badge status="processing" text="Pending" />
      )}
    </span>
  );
}

export function WalletStatus() {
  return (
    <Descriptions
      title="Wallet Info"
      bordered
      column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
    >
      <Descriptions.Item label="Account">
        <Account />
      </Descriptions.Item>
      <Descriptions.Item label="Balance">
        <Balance />
      </Descriptions.Item>
      <Descriptions.Item label="Chain ID">
        <ChainId />
      </Descriptions.Item>
      <Descriptions.Item label="Block Number">
        <BlockNumber />
      </Descriptions.Item>
      <Descriptions.Item label="Next Nonce">
        <NextNonce />
      </Descriptions.Item>
      <Descriptions.Item label="Status">
        <StatusIcon />
      </Descriptions.Item>
    </Descriptions>
  );
}
