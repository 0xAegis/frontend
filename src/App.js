import { useState, useEffect } from "react";

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button, Group, Text } from "@mantine/core";
import { ethers } from "ethers";
import { SocialLoginType } from "@arcana/auth";

import { getArcanaAuth } from "./utils/arcana";

const App = () => {
  const [polygonAccount, setPolygonAccount] = useState(null);
  const [arcanaAccount, setArcanaAccount] = useState(null);

  // Check if user is logged in to Arcana
  useEffect(() => {
    const arcanaAuth = getArcanaAuth({ baseUrl: window.location.origin });

    if (arcanaAuth.isLoggedIn()) {
      const userInfo = arcanaAuth.getUserInfo();
      console.log(userInfo);
      setArcanaAccount(userInfo);
    }
  }, []);

  // Connect to Arcana using social auth
  const connectArcana = async () => {
    const arcanaAuth = getArcanaAuth({ baseUrl: window.location.origin });

    await arcanaAuth.loginWithSocial(SocialLoginType.google);
    if (arcanaAuth.isLoggedIn()) {
      const userInfo = arcanaAuth.getUserInfo();
      console.log(userInfo);
      setArcanaAccount(userInfo);
    }
  };

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
    <>
      <Group>
        <Group>
          {polygonAccount ? (
            <Text>Connected to Polygon: {polygonAccount}</Text>
          ) : (
            <Button onClick={connectWallet}>Connect Wallet</Button>
          )}
        </Group>
        <Group>
          {arcanaAccount ? (
            <Text>Connected to Arcana: {arcanaAccount.userInfo.email}</Text>
          ) : (
            <Button onClick={connectArcana}>Connect Arcana</Button>
          )}
        </Group>
      </Group>
    </>
  );
};

export default App;
