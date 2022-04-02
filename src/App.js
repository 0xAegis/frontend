import { useEffect, useContext } from "react";

import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";
import { ethers } from "ethers";
import { Container } from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";

import Navigation from "./features/navigation/Navigation";
import { AppContext } from ".";
import { getFollowerNftCount, getNumNftsMinted, getUser } from "./utils/aegis";
import { getSenders } from "./utils/superfluid";

const App = observer(() => {
  const appStore = useContext(AppContext);
  const preferredColorScheme = useColorScheme();

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
      if (accounts.length) {
        appStore.setPolygonAccount(accounts[0]);
      }
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
  }, [appStore]);

  // Handle when chain (network) is changed
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
  }, []);

  // Handle when main account is changed
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      // It is recommended to reload the page
      window.location.reload();
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    // Remove event listener on cleanup
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  // On page load, check whether user has an account in Aegis
  useEffect(() => {
    const checkAegisAccount = async () => {
      if (!window.ethereum) {
        console.log("Metamask is not installed.");
        return;
      }
      //Checking If connection status is false
      if (!appStore.connectionStatus) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      try {
        const userInfo = await getUser({
          provider,
          account: appStore.polygonAccount,
        });
        // Update Mobx Store
        appStore.setUser(userInfo);
      } catch (error) {
        console.log("Error while fetching Aegis user:", error);
      }
    };

    checkAegisAccount();
  }, [appStore.checkConnectionStatus, appStore.polygonAccount, appStore]);

  useEffect(() => {
    const checkFollowers = async () => {
      if (!appStore.user) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // get all the money senders
      const moneySenders = await getSenders({
        provider,
        receiver: appStore.polygonAccount,
      });
      // also get whether they hold a follower NFT or not
      const senderIsFollower = await Promise.all(
        moneySenders.map(async (sender) => [
          sender,
          (await getFollowerNftCount({
            provider,
            follower: sender,
            followedUser: appStore.user,
          })) > 0,
        ])
      );
      // Filter the ones which returned true in last step, we did it in 2 steps because filter doesn't support async funcs
      const payingFollowers = senderIsFollower
        .filter(([sender, senderIsFollower]) => senderIsFollower)
        .map(([sender, senderIsFollower]) => sender);
      // Get total follower nfts minted for the user
      const numNftsMinted = await getNumNftsMinted({
        provider,
        nftAddress: appStore.user.nftAddress,
      });

      console.log(numNftsMinted, payingFollowers);
      appStore.setPayingFollowers(payingFollowers);
      appStore.setNumFollowerNftsMinted(numNftsMinted);
    };

    checkFollowers();
  }, [appStore.user, appStore.polygonAccount, appStore]);

  return (
    <MantineProvider
      theme={{ colorScheme: preferredColorScheme }}
      withGlobalStyles
    >
      <Container size="md">
        <Navigation>
          <Outlet />
        </Navigation>
      </Container>
    </MantineProvider>
  );
});

export default App;
