import { useEffect, useState } from "react";

import { Button, Container } from "@mantine/core";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";

const ConnectWallet = observer(({ pb, appStore }) => {
  const [chainIsValid, setChainIsValid] = useState(false);
  const setChainValidty = (network) => {
    if (network.chainId === parseInt(process.env.REACT_APP_CHAIN_ID)) {
      setChainIsValid(true);
    }
  };

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
      const network = await provider.getNetwork();
      // Update Mobx Store
      appStore.setPolygonAccount(accounts[0]);
      appStore.setNetwork(network);

      setChainValidty(network);
    };

    checkPolygonAccounts();
  }, [appStore]);

  // Connect Metamask wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      console.log("Metamask is not installed.");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const accounts = await provider.send("eth_requestAccounts");
    // Update Mobx Store
    appStore.setPolygonAccount(accounts[0]);
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
        // Convert chain id to hexadecimal format
        chainId: "0x" + parseInt(process.env.REACT_APP_CHAIN_ID).toString(16),
        rpcUrls: [process.env.REACT_APP_RPC_URL],
        chainName: process.env.REACT_APP_NETWORK_LONG_NAME,
        nativeCurrency: {
          name: "MATIC Token",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: [process.env.REACT_APP_BLOCK_EXPLORER_URL],
      },
    ]);
    const network = await provider.getNetwork();
    // Update Mobx Store
    appStore.setNetwork(network);
    setChainValidty(network);
  };

  return (
    <Container pb={pb} fluid>
      {appStore.polygonAccount ? (
        chainIsValid ? (
          <Button
            fullWidth
            color="lime"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Connected:{" "}
            {`${appStore.polygonAccount.slice(
              0,
              3
            )}...${appStore.polygonAccount.slice(-3)}`}
          </Button>
        ) : (
          <Button fullWidth color="yellow" onClick={changeChain}>
            Connect to Polygon!
          </Button>
        )
      ) : (
        <Button
          fullWidth
          onClick={async () => {
            await changeChain();
            await connectWallet();
          }}
        >
          Connect Wallet
        </Button>
      )}
    </Container>
  );
});

export default ConnectWallet;
