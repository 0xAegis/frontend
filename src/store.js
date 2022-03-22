import { makeAutoObservable } from "mobx";

export class AppStore {
  constructor() {
    makeAutoObservable(this);
  }
  user = null;
  posts = [];
  arcanaAccount = {};
  polygonAccount = "";
  chainIsValid = false;

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
    this.polygonAccount = polygonAccount;
  }

  setChainIsValid(network) {
    if (network.chainId === parseInt(process.env.REACT_APP_CHAIN_ID)) {
      this.chainIsValid = true;
    }
  }

  get connectionStatus() {
    if (this.polygonAccount && this.chainIsValid) {
      return true;
    }
    return false;
  }
}
