import { configureStore } from "@reduxjs/toolkit";

import connectWalletReducer from "./components/connect-wallet/connectWalletSlice";
import connectArcanaReducer from "./components/connect-arcana/connectArcanaSlice";

// Configure the root store combining the individual Slices
export const store = configureStore({
  reducer: {
    connectWallet: connectWalletReducer,
    connectArcana: connectArcanaReducer,
  },
});
