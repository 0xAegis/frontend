import { useEffect, useContext, useState } from "react";

import { useParams } from "react-router-dom";
import { Group, Text, Title, Loader, Button } from "@mantine/core";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";

import { CreatePost } from "../../posts/create-post/CreatePost";
import {
  followUser,
  getPostsOfUser,
  getUser,
  getUserHasFollowerNft,
} from "../../../utils/aegis";
import { PostList } from "../../posts/post-list/PostList";
import { AppContext } from "../../..";
import {
  createOrUpdateFlow,
  deleteFlow,
  getFlow,
  getSenders,
} from "../../../utils/superfluid";

export const UserProfile = observer(() => {
  const appStore = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followingInProcess, setFollowingInProcess] = useState(false);
  const [unfollowingInProcess, setUnfollowingInProcess] = useState(false);

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
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      //Introduce try catch block to handle error rising out of url with invalid account addresses
      try {
        const user = await getUser({ provider, account: params.userPubKey });
        const posts = await getPostsOfUser({
          provider,
          account: params.userPubKey,
        });
        const userHasFollowerNft = await getUserHasFollowerNft({
          provider,
          follower: appStore.polygonAccount,
          followed: params.userPubKey,
        });
        const flowInfo = await getFlow({
          provider,
          sender: appStore.polygonAccount,
          receiver: params.userPubKey,
        });
        const isFollowing =
          userHasFollowerNft &&
          flowInfo &&
          flowInfo.flowRate >= process.env.REACT_APP_SUPERFLUID_FLOW_RATE;

        // Update state
        setUser(user);
        setPosts(posts);
        setIsFollowing(isFollowing);
        await getSenders({ provider, receiver: params.userPubKey });
      } catch {
        console.log("error: check url for invalid account addresss");
      }

      setLoading(false);
    };

    fetchUserInfo();
  }, [
    params.userPubKey,
    appStore.connectionStatus,
    appStore.user,
    appStore.polygonAccount,
  ]);

  const handleFollow = async () => {
    setFollowingInProcess(true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const userHasFollowerNft = await getUserHasFollowerNft({
      provider,
      follower: appStore.polygonAccount,
      followed: params.userPubKey,
    });

    try {
      if (!userHasFollowerNft) {
        await followUser({
          provider,
          account: appStore.polygonAccount,
          user: params.userPubKey,
        });
      }
      await createOrUpdateFlow({
        provider,
        sender: appStore.polygonAccount,
        receiver: params.userPubKey,
      });
      setIsFollowing(true);
    } catch (error) {
      console.log("Some error happened while interacting with blockchain.");
    }

    setFollowingInProcess(false);
  };

  const handleUnfollow = async () => {
    setUnfollowingInProcess(true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      await deleteFlow({
        provider,
        sender: appStore.polygonAccount,
        receiver: params.userPubKey,
      });
      setIsFollowing(false);
    } catch (error) {
      console.log("Some error happened while interacting with blockchain.");
    }

    setUnfollowingInProcess(false);
  };

  return loading ? (
    <Loader />
  ) : user !== null ? (
    <Group direction="column">
      <Title order={1}>{user.name}</Title>
      <Text style={{ overflowWrap: "anywhere" }}>@{params.userPubKey}</Text>
      {params.userPubKey === appStore.polygonAccount ? (
        <CreatePost />
      ) : isFollowing ? (
        <Button onClick={handleUnfollow} loading={unfollowingInProcess}>
          Unsubscribe
        </Button>
      ) : (
        <Button onClick={handleFollow} loading={followingInProcess}>
          Subscribe
        </Button>
      )}
      <PostList posts={posts} />
    </Group>
  ) : (
    <Title order={2}>This user doesn't exist.</Title>
  );
});
