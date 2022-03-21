import { useEffect, useContext, useState } from "react";

import { useParams } from "react-router-dom";
import { Group, Text, Title, Notification, Button } from "@mantine/core";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";

import { CreateUser } from "../../auth/create-user/CreateUser";
import { CreatePost } from "../../posts/create-post/CreatePost";
import {
  followUser,
  getFollowerNftCount,
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
} from "../../../utils/superfluid";

export const UserProfile = observer(() => {
  const appStore = useContext(AppContext);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [hasOwnFollowerNft, setHasOwnFollowerNft] = useState(false);
  const [hasSomeFollowerNft, setHasSomeFollowerNft] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
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
        const flowInfo = await getFlow({
          provider,
          sender: appStore.polygonAccount,
          receiver: params.userPubKey,
        });

        // Update state
        setUser(user);
        setPosts(posts);
        setHasSomeFollowerNft(followerNftCount > 0);
        setHasOwnFollowerNft(userHasFollowerNft);
        setIsPaying(
          flowInfo &&
            flowInfo.flowRate >= process.env.REACT_APP_SUPERFLUID_FLOW_RATE
        );
      } catch {
        console.log("error: check url for invalid account addresss");
      }
    };

    fetchUserInfo();
  }, [
    params.userPubKey,
    appStore.connectionStatus,
    appStore.user,
    appStore.polygonAccount,
  ]);

  const handleMintFollowerNft = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await followUser({
      provider,
      account: appStore.polygonAccount,
      user: params.userPubKey,
    });
  };

  const handleCreateFlow = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await createOrUpdateFlow({
      provider,
      sender: appStore.polygonAccount,
      receiver: params.userPubKey,
    });
  };

  const handleDeleteFlow = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await deleteFlow({
      provider,
      sender: appStore.polygonAccount,
      receiver: params.userPubKey,
    });
  };

  const FollowButtons = () => (
    <Group direction="column">
      {hasOwnFollowerNft ? (
        <Text>You have your own follower NFT</Text>
      ) : hasSomeFollowerNft ? (
        <Button onClick={handleMintFollowerNft}>
          You have follower NFTs, you can also mint your own! Click here
        </Button>
      ) : (
        <Button onClick={handleMintFollowerNft}>Mint your follower NFT</Button>
      )}
      {isPaying ? (
        <Button onClick={handleDeleteFlow}>
          You are a paying user, click here to stop paying
        </Button>
      ) : (
        <Button onClick={handleCreateFlow}>Pay user</Button>
      )}
    </Group>
  );

  return user !== null ? (
    <Group direction="column">
      <Title order={1}>{user.name}</Title>
      <Text>@{params.userPubKey}</Text>
      {params.userPubKey === appStore.polygonAccount ? (
        <CreatePost />
      ) : (
        <FollowButtons />
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
