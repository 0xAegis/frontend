import { useState } from "react";

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button, Group, Text } from "@mantine/core";
import { ethers } from "ethers";

const ConnectWallet = () => {
  // The currently connected accounts
  const [polygonAccount, setPolygonAccount] = useState(null);

  // Callback which gets called when user clicks on connect wallet button
  const connectWallet = async () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID,
        },
      },
    };
    const web3Modal = new Web3Modal({
      network: "mainnet",
      providerOptions,
    });
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const accounts = await provider.send("eth_requestAccounts");
    if (accounts.length) {
      setPolygonAccount(accounts[0]);
    }
  };

  return (
    <Group direction="column">
      <Group>
        {polygonAccount ? (
          <Text>Connected to Polygon: {polygonAccount}</Text>
        ) : (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        )}
      </Group>
    </Group>
  );
};

export default ConnectWallet;
