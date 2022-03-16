import { Contract, ethers } from "ethers";

import { abi } from "./Aegis.json";

export const getAegis = ({ provider, account }) => {
  let signerOrProvider;
  if (account) {
    signerOrProvider = provider.getSigner(account);
  } else {
    signerOrProvider = provider;
  }
  const contract = new Contract(
    process.env.REACT_APP_AEGIS_ADDRESS,
    abi,
    signerOrProvider
  );
  return contract;
};

const formatUserInfo = (userInfo) => {
  return {
    username: userInfo.username,
    publicKey: userInfo.publicKey,
    nftAddress: userInfo.nftAddress,
  };
};

export const createUser = async ({ provider, account, username }) => {
  const aegis = getAegis({ provider, account });
  const createUserTx = await aegis.createUser(username);
  await createUserTx.wait();
  return formatUserInfo(await aegis.users(account));
};

export const getUser = async ({ provider, account }) => {
  const aegis = getAegis({ provider, account });
  const userInfo = await aegis.users(account);
  if (userInfo.publicKey === ethers.constants.AddressZero) {
    return null;
  }
  return formatUserInfo(userInfo);
};

const formatPost = (post) => {
  return {
    text: post.text,
    attachments: post.attachments,
    isPaid: post.isPaid,
  };
};

export const getPostsOfUser = async ({ provider, account }) => {
  const aegis = getAegis({ provider, account });
  const postCount = (await aegis.getPostCount(account)).toNumber();
  const posts = await Promise.all(
    Array(postCount).map(
      async (value, index) => await aegis.getPost(account, index)
    )
  );
  const formattedPosts = posts.map((value) => formatPost(value));
  return formattedPosts;
};
