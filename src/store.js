import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/auth/authSlice";

// Configure the root store combining the individual Slices
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
