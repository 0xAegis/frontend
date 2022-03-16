import { createSlice } from "@reduxjs/toolkit";

// Initial state of this Slice
const initialState = {
  account: null,
};

// Create a Redux Toolkit Slice which stores the state related to the ConnectArcana component
export const connectArcanaSlice = createSlice({
  name: "connectArcana",
  initialState,
  reducers: {
    // Change account, payload is {userInfo}, where userInfo is the Arcana user info
    changeAccount: (state, action) => {
      state.account = action.payload.userInfo;
    },
  },
});

export const { changeAccount } = connectArcanaSlice.actions;
export const selectAccount = (state) => state.connectArcana.account;

export default connectArcanaSlice.reducer;
