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
