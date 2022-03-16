import { Contract } from "ethers";

import config from "./config.json";

export const getAegis = ({ provider, polygonAccount }) => {
  let signerOrProvider;
  if (polygonAccount) {
    signerOrProvider = provider.getSigner(polygonAccount);
  } else {
    signerOrProvider = provider;
  }
  const contract = new Contract(
    config.aegisAddress,
    config.aegisAbi,
    signerOrProvider
  );
  return contract;
};
