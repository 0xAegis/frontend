import { Contract } from "ethers";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import { abi as aegisABI } from "./Aegis.json";
import { abi as aegisSupporterTokenABI } from "./AegisSupporterToken.json";

const getAegis = ({ provider, account }) => {
  let signerOrProvider;
  if (account) {
    signerOrProvider = provider.getSigner(account);
  } else {
    signerOrProvider = provider;
  }
  const contract = new Contract(
    process.env.REACT_APP_AEGIS_ADDRESS,
    aegisABI,
    signerOrProvider
  );
  return contract;
};

const formatUserInfo = (userInfo) => {
  return {
    name: userInfo.name,
    publicKey: userInfo.publicKey,
    nftAddress: userInfo.nftAddress,
    arcanaPublicKey: userInfo.arcanaPublicKey,
  };
};

//format a post fetched from ethers to a sane and predictable format
const formatPost = ({ post }) => {
  return {
    user: post.author,
    text: post.text,
    attachments: post.attachments,
    isPaid: post.isPaid,
    timestamp: post.timestamp.toNumber(),
  };
};

export const createUser = async ({
  provider,
  account,
  name,
  arcanaPublicKey,
}) => {
  const aegis = getAegis({ provider, account });
  const createUserTx = await aegis.createUser(name, arcanaPublicKey);
  await createUserTx.wait();
  return formatUserInfo(await aegis.users(account));
};

export const createPost = async ({
  provider,
  account,
  text,
  attachments,
  isPaid,
}) => {
  const aegis = getAegis({ provider, account });
  const createPostTx = await aegis.createPost(text, attachments, isPaid);
  const txReceipt = await createPostTx.wait();
  const postCreatedEvent = txReceipt.events.filter((x) => {
    return x.event === "PostCreated";
  })[0];
  return formatPost({ post: postCreatedEvent.args, creator: account });
};

export const followUser = async ({ provider, account, user }) => {
  const aegis = getAegis({ provider, account });
  const followUserTx = await aegis.followUser(user);
  await followUserTx.wait();
};

export const getUser = async ({ provider, account }) => {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPH_API_URL,
    cache: new InMemoryCache(),
  });

  const query = `
    query ($userId: String) {
      user(id: $userId) {
        id
        name
        arcanaPublicKey
        nftAddress
        posts(orderBy: timestamp, orderDirection: desc) {
          isPaid
          timestamp
          text
          attachments
          author {
            id
          }
        }
      }
    }`;
  const result = await client.query({
    query: gql(query),
    variables: {
      userId: account.toLowerCase(),
    },
  });
  return result.data.user;
};

export const getPostsOfUser = async ({ provider, account }) => {
  const aegis = getAegis({ provider, account });
  //create a filter for filtering events: account should be the user
  const filter = aegis.filters.PostCreated(account);
  //get all the events that match the above filter
  const postCreatedEvents = await aegis.queryFilter(filter);
  const posts = postCreatedEvents.map((event) => event.args);

  const formattedPosts = posts.map((post) => formatPost({ post }));
  return formattedPosts;
};

export const getFollowerNftCount = async ({
  provider,
  follower,
  followedUser,
}) => {
  const aegisFollowers = new Contract(
    followedUser.nftAddress,
    aegisSupporterTokenABI,
    provider
  );
  const count = (await aegisFollowers.balanceOf(follower)).toNumber();
  return count;
};

export const getNumNftsMinted = async ({ provider, nftAddress }) => {
  const aegisFollowers = new Contract(
    nftAddress,
    aegisSupporterTokenABI,
    provider
  );
  return (await aegisFollowers.totalSupply()).toNumber();
};

export const getUserHasFollowerNft = async ({
  provider,
  follower,
  followed,
}) => {
  const aegis = getAegis({ provider });
  return aegis.userHasFollowerNft(followed, follower);
};

export const getFollowerNftId = async ({ provider, nftAddress, account }) => {
  const aegisFollowers = new Contract(
    nftAddress,
    aegisSupporterTokenABI,
    provider
  );
  return (await aegisFollowers.tokenOfOwnerByIndex(account, 0)).toNumber();
};
