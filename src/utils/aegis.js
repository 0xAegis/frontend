import { Contract, ethers } from "ethers";

import { abi as aegisABI } from "./Aegis.json";
import { abi as aegisFollowersABI } from "./AegisFollowers.json";

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
const formatPost = ({ post, creator }) => {
  return {
    user: post.user,
    postIndex: post.postIndex.toNumber(),
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

export const getUser = async ({ provider, account }) => {
  const aegis = getAegis({ provider, account });
  const userInfo = await aegis.users(account);
  if (userInfo.publicKey === ethers.constants.AddressZero) {
    return null;
  }
  return formatUserInfo(userInfo);
};

export const getPostsOfUser = async ({ provider, account }) => {
  const aegis = getAegis({ provider, account });
  //create a filter for filtering events: account should be the user
  const filter = aegis.filters.PostCreated(account);
  //get all the events that match the above filter
  const postCreatedEvents = await aegis.queryFilter(filter);
  const posts = postCreatedEvents.map((event) => event.args);

  const formattedPosts = posts.map((post) =>
    formatPost({ post, creator: account })
  );
  console.log(formattedPosts);
  return formattedPosts;
};

export const followUser = async ({ provider, account, user }) => {
  const aegis = getAegis({ provider, account });
  const followUserTx = await aegis.followUser(user);
  await followUserTx.wait();
};

export const getFollowerNftCount = async ({ provider, follower, followed }) => {
  const followedUser = await getUser({ provider, account: followed });
  if (!followedUser) {
    return;
  }
  const aegisFollowers = new Contract(
    followedUser.nftAddress,
    aegisFollowersABI,
    provider
  );
  return (await aegisFollowers.balanceOf(follower)).toNumber();
};

export const getUserHasFollowerNft = async ({
  provider,
  follower,
  followed,
}) => {
  const aegis = getAegis({ provider });
  return aegis.userHasFollowerNft(followed, follower);
};
