import { Button } from "@mantine/core";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { UploadFile } from "./components/UploadFile";
import { getArcanaAuth } from "./utils/arcana";
import { SocialLoginType } from "@arcana/auth";

const App = () => {
  const [polygonAccount, setPolygonAccount] = useState(null);
  const [arcanaAccount, setArcanaAccount] = useState(null);
  const arcanaAuth = getArcanaAuth({ baseUrl: window.location.origin });

  // Check if user is logged in to Arcana
  useEffect(() => {
    if (arcanaAuth.isLoggedIn()) {
      const userInfo = arcanaAuth.getUserInfo();
      console.log(userInfo);
      setArcanaAccount(userInfo);
    }
  }, [arcanaAuth]);

  // Connect to Arcana using social auth
  const connectArcana = async () => {
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
      {polygonAccount ? (
        "Connected to Polygon: " + polygonAccount
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
      <UploadFile />
      {arcanaAccount ? (
        "Connected to Arcana: " + arcanaAccount.userInfo.email
      ) : (
        <Button onClick={connectArcana}>Connect Arcana</Button>
      )}
    </>
  );
};

export default App;
