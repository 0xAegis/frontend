import { Group } from "@mantine/core";
import { Post } from "../post/Post";

export const PostList = ({ posts }) => {
  return (
    <Group direction="column">
      {posts.map((post) => (
        <Post {...post} key={post.user + "::" + post.postIndex.toString()} />
      ))}
    </Group>
  );
};
