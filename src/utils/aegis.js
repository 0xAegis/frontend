import { Contract } from "ethers";

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

export const createUser = async ({ provider, account, username }) => {
  const aegis = getAegis({ provider, account });
  const createUserTx = await aegis.createUser(username);
  await createUserTx.wait();
  return await aegis.users(account);
};

const formatPostInfo = (post) => {
  return {
    text: post.text,
    attachments: post.attachments,
    isPaid: post.isPaid,
  };
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
  const postCreatedEvent = txReceipt.events?.filter((x) => {
    return x.event === "PostCreated";
  })[0];
  return formatPostInfo(postCreatedEvent.args);
};
