import { useEffect, useContext, useState } from "react";

import { useParams } from "react-router-dom";
import { Group, Text, Title, Notification, Button } from "@mantine/core";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";

import { CreateUser } from "../../auth/create-user/CreateUser";
import { CreatePost } from "../../posts/create-post/CreatePost";
import {
  getFollowerNftCount,
  getPostsOfUser,
  getUser,
  getUserHasFollowerNft,
} from "../../../utils/aegis";
import { PostList } from "../../posts/post-list/PostList";
import { AppContext } from "../../..";
import { createFlow } from "../../../utils/superfluid";

export const UserProfile = observer(() => {
  const appStore = useContext(AppContext);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [hasOwnFollowerNft, setHasOwnFollowerNft] = useState(false);
  const [hasSomeFollowerNft, setHasSomeFollowerNft] = useState(false);
  const params = useParams();

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
        const followerNftCount = await getFollowerNftCount({
          provider,
          follower: appStore.polygonAccount,
          followed: params.userPubKey,
        });
        const userHasFollowerNft = await getUserHasFollowerNft({
          provider,
          follower: appStore.polygonAccount,
          followed: params.userPubKey,
        });
        // Update state
        setUser(user);
        setPosts(posts);
        setHasSomeFollowerNft(followerNftCount > 0);
        setHasOwnFollowerNft(userHasFollowerNft);
      }
    };

    fetchUserInfo();
  }, [
    params.userPubKey,
    appStore.connectionStatus,
    appStore.user,
    appStore.polygonAccount,
    posts,
    user,
  ]);

  const handleFollowUser = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // await followUser({
    //   provider,
    //   account: appStore.polygonAccount,
    //   user: params.userPubKey,
    // });
    await createFlow({ provider, recipient: params.userPubKey, flowRate: 1 });
  };

  return user !== null ? (
    <Group direction="column">
      <Title order={1}>{user.name}</Title>
      <Text>@{params.userPubKey}</Text>
      {params.userPubKey === appStore.polygonAccount ? (
        <CreatePost />
      ) : (
        <Button onClick={handleFollowUser}>Follow User</Button>
      )}
      <PostList posts={posts} />
    </Group>
  ) : (
    <>
      {params.userPubKey === appStore.polygonAccount ? (
        <CreateUser />
      ) : (
        <Notification color="red" disallowClose>
          User Not Found!{" "}
        </Notification>
      )}
    </>
  );
});
