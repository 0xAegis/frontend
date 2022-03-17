import { Group } from "@mantine/core";
import { Post } from "../post/Post";

export const PostList = ({ posts }) => {
  return (
    <Group>
      {posts.map((post) => (
        <Post {...post} />
      ))}
    </Group>
  );
};
