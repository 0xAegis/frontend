import { useEffect, useContext } from "react";

import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";
import { ethers } from "ethers";

import Navigation from "./features/navigation/Navigation";
import { AppContext } from ".";
import { getUser } from "./utils/aegis";
const App = observer(() => {
  const appStore = useContext(AppContext);
  // let navigate = useNavigate();
  // let params = useParams();

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
  });

  // Handle when main account is changed
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
      const userInfo = await getUser({
        provider,
        account: appStore.polygonAccount,
      });
      console.log(userInfo);
      // Update Mobx Store
      appStore.setUser(userInfo);
    };

    checkAegisAccount();
  }, [appStore.checkConnectionStatus, appStore.polygonAccount, appStore]);

  return (
    <Navigation>
      <Outlet />
    </Navigation>
  );
});

export default App;
