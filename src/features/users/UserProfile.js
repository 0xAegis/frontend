import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { Group, Text } from "@mantine/core";
import { ethers } from "ethers";

import { getPostsOfUser, getUser } from "../../utils/aegis";
import { PostList } from "../posts/post-list/PostList";

export const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const account = params.username;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const userInfo = await getUser({ provider, account });
      const posts = await getPostsOfUser({ provider, account });
      setUserInfo(userInfo);
      setPosts(posts);
    };

    fetchUserInfo();
  }, [params.username]);

  return userInfo ? (
    <Group>
      <Text weight="bold">{userInfo.username}</Text>
      <PostList posts={posts} />
    </Group>
  ) : (
    <Text>not found</Text>
  );
};
