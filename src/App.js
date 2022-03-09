import { Button } from "@mantine/core";
import { ethers } from "ethers";
import { useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);

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
      setCurrentAccount(accounts[0]);
    }
  };

  return currentAccount ? (
    currentAccount
  ) : (
    <Button onClick={connectWallet}>Connect Wallet</Button>
  );
};

export default App;
