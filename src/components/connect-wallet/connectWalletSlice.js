import { createSlice } from "@reduxjs/toolkit";

const VALID_CHAIN_IDS = [137];

// Initial state of this Slice
const initialState = {
  account: null,
  chainId: null,
  chainIsValid: false,
};

// Create a Redux Toolkit Slice which stores the state related to the ConnectWallet component
export const connectWalletSlice = createSlice({
  name: "connectWallet",
  initialState,
  reducers: {
    // Change account, payload is {accounts}, where accounts is the currently connected accounts
    changeAccount: (state, action) => {
      if (action.payload.accounts.length) {
        state.account = action.payload.accounts[0];
      } else {
        state.account = null;
      }
    },
    // Change network, payload is {network}, where network is the network info object
    changeNetwork: (state, action) => {
      state.chainId = action.payload.network.chainId;
      state.chainIsValid = VALID_CHAIN_IDS.includes(
        action.payload.network.chainId
      );
    },
  },
});

export const { changeAccount, changeNetwork } = connectWalletSlice.actions;
export const selectAccount = (state) => state.connectWallet.account;
export const selectChainIsValid = (state) => state.connectWallet.chainIsValid;

export default connectWalletSlice.reducer;
