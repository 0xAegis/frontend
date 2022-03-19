import { useEffect, useContext } from "react";

import { useParams } from "react-router-dom";
import { Group, Text } from "@mantine/core";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";

import { getPostsOfUser, getUser } from "../../../utils/aegis";
import { PostList } from "../../posts/post-list/PostList";
import { AppContext } from "../../..";

export const UserProfile = observer(() => {
  const appStore = useContext(AppContext);
  const params = useParams();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!appStore.user.name) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const user = await getUser({ provider, account: params.userPubKey });
        const posts = await getPostsOfUser({
          provider,
          account: params.userPubKey,
        });
        // Update Mobx Store
        appStore.setUser(user);
        appStore.setPosts(posts);
      }
    };

    fetchUserInfo();
  }, [params.userPubKey, appStore]);

  return appStore.user ? (
    <Group direction="column">
      <Text weight="bold">{appStore.user.name}</Text>
      <PostList posts={appStore.posts} />
    </Group>
  ) : (
    <Text>not found</Text>
  );
});
