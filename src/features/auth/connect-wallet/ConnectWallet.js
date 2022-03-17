import { useEffect } from "react";

import { Button, Container } from "@mantine/core";
import { ethers } from "ethers";
import { useSelector, useDispatch } from "react-redux";

import {
  selectPolygonAccount,
  selectPolygonChainIsValid,
  updatePolygonAccounts,
  updatePolygonNetwork,
} from "../authSlice";

const ConnectWallet = ({ pb }) => {
  // Redux dispatcher
  const dispatch = useDispatch();
  // fetch account and chainIsValid from the Redux store
  const account = useSelector(selectPolygonAccount);
  const chainIsValid = useSelector(selectPolygonChainIsValid);

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
      // Dispatch changes to Redux
      dispatch(updatePolygonAccounts({ accounts }));
      dispatch(updatePolygonNetwork({ network }));
    };

    checkPolygonAccounts();
  }, [dispatch]);

  // Connect Metamask wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      console.log("Metamask is not installed.");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const accounts = await provider.send("eth_requestAccounts");
    // Dispatch changes to Redux
    dispatch(updatePolygonAccounts({ accounts }));
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
    // Dispatch changes to Redux
    dispatch(updatePolygonNetwork({ network }));
  };

  return (
    <Container pb={pb} fluid>
      {account ? (
        chainIsValid ? (
          <Button
            fullWidth
            color="lime"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Connected: {`${account.slice(0, 3)}...${account.slice(-3)}`}
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
};

export default ConnectWallet;
