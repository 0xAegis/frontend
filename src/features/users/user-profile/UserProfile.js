import { useEffect, useContext, useState } from "react";

import { useParams } from "react-router-dom";
import { Group, Text } from "@mantine/core";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";

import { getPostsOfUser, getUser } from "../../../utils/aegis";
import { PostList } from "../../posts/post-list/PostList";

export const UserProfile = observer(() => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user.name) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const user = await getUser({ provider, account: params.userPubKey });
        const posts = await getPostsOfUser({
          provider,
          account: params.userPubKey,
        });
        // Update Mobx Store
        setUser(user);
        setPosts(posts);
      }
    };

    fetchUserInfo();
  }, [params.userPubKey, user]);

  return user ? (
    <Group direction="column">
      <Text weight="bold">{user.name}</Text>
      <PostList posts={posts} />
    </Group>
  ) : (
    <Text>not found</Text>
  );
});
