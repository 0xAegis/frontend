import { useState } from "react";

import Web3Modal from "web3modal";
import { Button, Group, Text } from "@mantine/core";
import { ethers } from "ethers";

const ConnectWallet = () => {
  // The currently connected accounts
  const [polygonAccount, setPolygonAccount] = useState(null);

  // Callback which gets called when user clicks on connect wallet button
  const connectWallet = async () => {
    const web3Modal = new Web3Modal({
      network: "polygon",
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
