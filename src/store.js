import { configureStore } from "@reduxjs/toolkit";

import connectWalletReducer from "./components/connect-wallet/connectWalletSlice";

// Configure the root store combining the individual Slices
export const store = configureStore({
  reducer: {
    connectWallet: connectWalletReducer,
  },
});
