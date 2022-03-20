import { useEffect, useContext, useState } from "react";

import { useParams } from "react-router-dom";
import { Group, Text } from "@mantine/core";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";

import { CreateUser } from "../../auth/create-user/CreateUser";
import { CreatePost } from "../../posts/create-post/CreatePost";
import { getPostsOfUser, getUser } from "../../../utils/aegis";
import { PostList } from "../../posts/post-list/PostList";
import { AppContext } from "../../..";

export const UserProfile = observer(() => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const params = useParams();
  const appStore = useContext(AppContext);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!window.ethereum) {
        console.log("Metamask is not installed.");
        return;
      }
      //Checking If connection status is false
      if (!appStore.connectionStatus) {
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      //Introduce try catch block to handle error rising out of url with invalid account addresses
      try {
        const user = await getUser({ provider, account: params.userPubKey });
        const posts = await getPostsOfUser({
          provider,
          account: params.userPubKey,
        });
        setUser(user);
        setPosts(posts);
      } catch {
        console.log("error: check url for invalid account addresss");
      }
    };

    fetchUserInfo();
  }, [params.userPubKey, appStore.connectionStatus, appStore.user]);

  return user !== null ? (
    <Group direction="column">
      <Text weight="bold">{user.name}</Text>
      {params.userPubKey === appStore.polygonAccount ? <CreatePost /> : null}

      <PostList posts={posts} />
    </Group>
  ) : (
    <CreateUser />
  );
});
