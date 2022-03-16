import { Framework } from "@superfluid-finance/sdk-core";

const getSuperfluid = async ({ provider }) => {
  const sf = await Framework.create({
    networkName: process.env.REACT_APP_NETWORK_NAME,
    provider: provider,
  });
  const signer = sf.createSigner({ provider });
  return { sf, signer };
};

export const createFlow = async ({ provider, recipient, flowRate }) => {
  const { sf, signer } = await getSuperfluid({ provider });

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      flowRate: flowRate,
      receiver: recipient,
      superToken: process.env.REACT_APP_DAIX_ADDRESS,
    });
    console.log("Creating your stream...");
    const result = await createFlowOperation.exec(signer);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

export const deleteFlow = async ({ provider, sender, recipient }) => {
  const { sf, signer } = await getSuperfluid({ provider });

  try {
    const deleteFlowOperation = sf.cfaV1.deleteFlow({
      sender,
      receiver: recipient,
      superToken: process.env.REACT_APP_DAIX_ADDRESS,
    });
    console.log("Deleting your stream...");
    const result = await deleteFlowOperation.exec(signer);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
