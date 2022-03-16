import { createSlice } from "@reduxjs/toolkit";

// Initial state of this Slice
const initialState = {
  arcana: {
    userInfo: null,
  },
  polygon: {
    accounts: [],
    chainId: null,
    chainIsValid: false,
  },
};

// Create a Redux Toolkit Slice which stores the state related to the ConnectArcana component
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Change account, payload is {userInfo}, where userInfo is the Arcana user info
    loginToArcana: (state, action) => {
      state.arcana.userInfo = action.payload.userInfo;
    },
    // Change account, payload is {accounts}, where accounts is the currently connected accounts
    updatePolygonAccounts: (state, action) => {
      state.polygon.accounts = action.payload.accounts;
    },
    // Change network, payload is {network}, where network is the network info object
    updatePolygonNetwork: (state, action) => {
      state.polygon.chainId = action.payload.network.chainId;
      state.polygon.chainIsValid =
        parseInt(process.env.REACT_APP_CHAIN_ID) ===
        action.payload.network.chainId;
    },
  },
});

// Actions
export const { updatePolygonAccounts, updatePolygonNetwork, loginToArcana } =
  authSlice.actions;

// Selectors
export const selectPolygonAccount = (state) =>
  state.auth.polygon.accounts.length ? state.auth.polygon.accounts[0] : null;
export const selectPolygonChainIsValid = (state) =>
  state.auth.polygon.chainIsValid;
export const selectArcanaUserInfo = (state) => state.auth.arcana.userInfo;

export default authSlice.reducer;
