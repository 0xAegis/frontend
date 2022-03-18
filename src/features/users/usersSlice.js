import { createSlice } from "@reduxjs/toolkit";

// Initial state of this Slice
const initialState = {};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Create post, payload is {post}
    addPost: (state, action) => {
      const post = action.payload.post;
      if (!state[post.user]) {
        state[post.user] = { user: {}, posts: {} };
      }
      state[post.user].posts[post.postIndex] = post;
    },
    // Fetch user
    addUserProfile: (state, action) => {
      const user = action.payload.user;
      const posts = action.payload.posts;
      if (!state[user.publicKey]) {
        state[user.publicKey] = { user: {}, posts: {} };
      }
      state[user.publicKey].user = user;
      state[user.publicKey].posts = posts;
    },
  },
});

// Actions
export const { addPost, addUserProfile } = usersSlice.actions;

// Selectors
export const selectUserProfile = (state, user) => state.users[user];

export default usersSlice.reducer;
