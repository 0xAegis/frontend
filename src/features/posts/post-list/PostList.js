import { Group, Table } from "@mantine/core";
import { Post } from "../post/Post";
import "./postList.css";
export const PostList = ({ posts }) => {
  const postRows = posts.map((post, index) => (
    <tr key={index}>
      <td>
        <Post {...post} key={post.user + "::" + post.postIndex.toString()} />
      </td>
    </tr>
  ));

  return (
    <Group direction="column">
      {/* {posts.map((post) => (
        <Post {...post} key={post.user + "::" + post.postIndex.toString()} />
      ))} */}
      <Table>
        <thead>
          <tr>
            <th>Posts</th>
          </tr>
        </thead>
        <tbody>{postRows}</tbody>
      </Table>
    </Group>
  );
};
