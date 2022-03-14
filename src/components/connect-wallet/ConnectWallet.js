import { useState, useEffect } from "react";

import { Button, Group, Text } from "@mantine/core";
import { ethers } from "ethers";

const ConnectWallet = () => {
  // The currently connected Polygon account
  const [polygonAccount, setPolygonAccount] = useState(null);
  // Whether Metamask is on the right chain
  const [chainIsValid, setChainIsValid] = useState(false);

  // On page load, check whether Metamask is connected and to the right chain
  useEffect(() => {
    const checkPolygonAccounts = async () => {
      if (!window.ethereum) {
        console.log("Metamask is not installed.");
        return;
      }
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const accounts = await provider.listAccounts();
      if (accounts.length) {
        setPolygonAccount(accounts[0]);
      }
      let a = await provider.getNetwork();
      console.log(a.chainId);
      setChainIsValid((await provider.getNetwork()).chainId === 137);
    };

    checkPolygonAccounts();
  }, []);

  // Connect Metamask wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      console.log("Metamask is not installed.");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const accounts = await provider.send("eth_requestAccounts");
    if (accounts.length) {
      setPolygonAccount(accounts[0]);
    }
  };

  // Change chain on Metamask to Polygon mainnet
  const changeChain = async () => {
    if (!window.ethereum) {
      console.log("Metamask is not installed.");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("wallet_addEthereumChain", [
      {
        chainId: "0x89",
        rpcUrls: ["https://rpc-mainnet.matic.network/"],
        chainName: "Polygon Mainnet",
        nativeCurrency: {
          name: "MATIC Token",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: ["https://polygonscan.com/"],
      },
    ]);
    let a = await provider.getNetwork();
    console.log(a.chainId);
    setChainIsValid((await provider.getNetwork()).chainId === 137);
  };

  return (
    <Group direction="column">
      <Group>
        {polygonAccount ? (
          <Text>Connected Wallet: {polygonAccount}</Text>
        ) : (
          <Button
            onClick={async () => {
              await changeChain();
              await connectWallet();
            }}
          >
            Connect Wallet
          </Button>
        )}
      </Group>
      <Group>
        {polygonAccount ? (
          chainIsValid ? null : (
            <Button onClick={changeChain}>
              Invalid chain, click here to connect to Polygon.
            </Button>
          )
        ) : null}
      </Group>
    </Group>
  );
};

export default ConnectWallet;
