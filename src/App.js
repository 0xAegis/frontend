import { useEffect, useContext } from "react";

import { Group } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";
import { ethers } from "ethers";

import { CreateUser } from "./features/auth/create-user/CreateUser";
import Navigation from "./features/navigation/Navigation";
import { CreatePost } from "./features/posts/create-post/CreatePost";
import { AppContext } from ".";

const App = observer(() => {
  const appStore = useContext(AppContext);
  useEffect(() => {
    // On page load, check whether Metamask is connected and to the right chain
    const checkConnectionStatus = async () => {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const accounts = await provider.listAccounts();
      const network = await provider.getNetwork();
      // Update Mobx Store
      appStore.setPolygonAccount(accounts[0]);
      appStore.setChainIsValid(network);
      if (!appStore.polygonAccount) {
        console.log("no account");
        return;
      }
      if (!window.ethereum) {
        console.log("Metamask is not installed.");
        return;
      }
      if (!appStore.chainIsValid) {
        console.log("Chain is not valid");
        return;
      }
      appStore.setConnectionStatus();
    };
    checkConnectionStatus();
  });

  /* Handle when chain (network) is changed  */
  useEffect(() => {
    const handleChainChanged = (chainId) => {
      // It is recommended to reload the page
      window.location.reload();
    };
    window.ethereum.on("chainChanged", handleChainChanged);

    // Remove event listener on cleanup
    return () => {
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  });

  /* Handle when main account is changed  */
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log("Please connect to MetaMask.");
      } else if (accounts[0] !== appStore.polygonAccount) {
        appStore.setPolygonAccount(accounts[0]);
      }
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    // Remove event listener on cleanup
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  });

  return (
    <Navigation>
      <Group direction="column">
        <CreatePost />
        <CreateUser />
      </Group>
      <Outlet />
    </Navigation>
  );
});

export default App;
