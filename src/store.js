import { makeAutoObservable } from "mobx";

export class AppStore {
  constructor() {
    makeAutoObservable(this);
  }
  user = {};
  posts = [];
  arcanaAccount = {};
  polygonAccount = "";
  network = "";

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
  setNetwork(network) {
    this.network = network;
  }
}
