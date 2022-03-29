import { useEffect, useContext, useState } from "react";

import { Group, Text, Title, Loader } from "@mantine/core";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";

import { PostList } from "../../posts/post-list/PostList";
import { getUserHasFollowerNft } from "../../../utils/aegis";
import { AppContext } from "../../..";
import { getPostsOfUser } from "../../../utils/aegis";
import { getReceivers } from "../../../utils/superfluid";

export const Home = observer(() => {
  const appStore = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [followedUsers, setFollowedUsers] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
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
      try {
        const receivers = await getReceivers({
          provider,
          sender: appStore.polygonAccount,
        });

        const results = await Promise.all(
          receivers.map((receiver) => {
            return getUserHasFollowerNft({
              provider,
              follower: appStore.polygonAccount,
              followed: receiver,
            });
          })
        );
        let filteredReceivers = [];

        results.forEach((result, index) => {
          if (result) filteredReceivers.push(receivers[index]);
        });

        if (filteredReceivers.length !== 0) {
          setFollowedUsers(filteredReceivers);
        }
      } catch (err) {
        console.log("error :", err);
      }

      setLoading(false);
    };

    fetchFollowedUsers();
  }, [appStore.polygonAccount, appStore.connectionStatus]);

  useEffect(() => {
    if (!window.ethereum) {
      console.log("Metamask is not installed.");
      return;
    }
    //Checking If connection status is false
    if (!appStore.connectionStatus) {
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let allPosts = [];
    const fetchAllPosts = async (followedUser) => {
      let fetchedPosts = await getPostsOfUser({
        provider,
        account: followedUser,
      });

      fetchedPosts.forEach((post) => allPosts.push(post));
      setPosts(allPosts);
    };
    if (followedUsers !== null) {
      followedUsers.forEach((followedUser) => {
        fetchAllPosts(followedUser);
      });
    }
  }, [appStore.connectionStatus, followedUsers]);

  return loading ? (
    <Group direction="row">
      <Text size="xl">Loading...</Text>
      <Loader />
    </Group>
  ) : appStore.polygonAccount === null ? (
    <Title order={2}>{"Please connect wallet."}</Title>
  ) : appStore.user === null ? (
    <Title order={2}>{"Please create an account."}</Title>
  ) : followedUsers === null ? (
    <Title order={2}>{"You have not followed any users yet."}</Title>
  ) : (
    <Group direction="column">
      <Title order={1}>{"All Posts"}</Title>
      <PostList posts={posts} />
    </Group>
  );
});
