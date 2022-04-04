import { makeAutoObservable } from "mobx";

export class AppStore {
  constructor() {
    makeAutoObservable(this);
  }
  user = null;
  posts = [];
  arcanaAccount = null;
  polygonAccount = null;
  chainIsValid = false;
  numFollowerNftsMinted = 0;
  payingFollowers = [];
  metamaskInstalled = false;

  setUser(user) {
    this.user = user;
  }
  setPosts(posts) {
    this.posts = posts;
  }

  setArcanaAccount(arcanaAccount) {
    this.arcanaAccount = arcanaAccount;
  }

  setPolygonAccount(polygonAccount) {
    console.log(polygonAccount);
    this.polygonAccount = polygonAccount;
  }

  setChainIsValid(network) {
    if (network.chainId === parseInt(process.env.REACT_APP_CHAIN_ID)) {
      this.chainIsValid = true;
    }
  }

  setMetamaskInstalled(metamaskInstalled) {
    this.metamaskInstalled = metamaskInstalled;
  }

  get connectionStatus() {
    if (this.polygonAccount && this.chainIsValid) {
      return true;
    }
    return false;
  }

  setNumFollowerNftsMinted(numFollowerNftsMinted) {
    this.numFollowerNftsMinted = numFollowerNftsMinted;
  }

  setPayingFollowers(payingFollowers) {
    this.payingFollowers = payingFollowers;
  }
}
