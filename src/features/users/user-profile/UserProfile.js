import { useEffect } from "react";

import { useParams } from "react-router-dom";
import { Group, Text } from "@mantine/core";
import { ethers } from "ethers";

import { getPostsOfUser, getUser } from "../../../utils/aegis";
import { PostList } from "../../posts/post-list/PostList";
import { useDispatch, useSelector } from "react-redux";
import { addUserProfile, selectUserProfile } from "../usersSlice";

export const UserProfile = () => {
  const params = useParams();
  const userProfile = useSelector((state) =>
    selectUserProfile(state, params.userPubKey)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userProfile) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const user = await getUser({ provider, account: params.userPubKey });
        const posts = await getPostsOfUser({
          provider,
          account: params.userPubKey,
        });
        console.log(user, posts);
        dispatch(addUserProfile({ user, posts }));
      }
    };

    fetchUserInfo();
  }, [params.userPubKey, dispatch, userProfile]);

  return userProfile ? (
    <Group direction="column">
      <Text weight="bold">{userProfile.user.name}</Text>
      <PostList posts={userProfile.posts} />
    </Group>
  ) : (
    <Text>not found</Text>
  );
};
