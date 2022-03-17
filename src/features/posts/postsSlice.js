import { createSlice } from "@reduxjs/toolkit";

// Initial state of this Slice
const initialState = [];

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Create post, payload is {postInfo}, where postInfo is the post object
    createPost: (state, action) => {
      state.append(action.payload.postInfo);
    },
  },
});

// Actions
export const { createPost } = postsSlice.actions;

// Selectors
export const selectPostsByCreator = (state, creatorPublicKey) =>
  state.posts.filter((value) => value.creator === creatorPublicKey);

export default postsSlice.reducer;
