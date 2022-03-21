import { Framework } from "@superfluid-finance/sdk-core";

const getSuperfluid = async ({ provider }) => {
  const sf = await Framework.create({
    networkName: process.env.REACT_APP_NETWORK_NAME,
    provider: provider,
  });
  console.log("creatin signer");
  const signer = sf.createSigner({ web3Provider: provider });
  return { sf, signer };
};

export const createFlow = async ({ provider, recipient, flowRate }) => {
  console.log("creating flow");
  const { sf, signer } = await getSuperfluid({ provider });
  console.log("creating flow 1");

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      flowRate: flowRate,
      receiver: recipient,
      superToken: process.env.REACT_APP_USDCX_ADDRESS,
      overrides: {
        gasLimit: 1000000,
      },
    });
    console.log("Creating your stream...");
    const result = await createFlowOperation.exec(signer);
    console.log(result);
  } catch (error) {
    console.log("creating flow error");

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
