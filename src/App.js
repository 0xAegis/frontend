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
    };
    checkConnectionStatus();
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
