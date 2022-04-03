import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

export const uploadToIpfs = async (files) => {
  const client = new Web3Storage({
    token: process.env.REACT_APP_WEB3_STORAGE_TOKEN,
  });
  return await client.put(files);
};
