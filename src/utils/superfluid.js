import { Framework } from "@superfluid-finance/sdk-core";

const getSuperfluid = async ({ provider }) => {
  const sf = await Framework.create({
    networkName: process.env.REACT_APP_NETWORK_NAME,
    provider: provider,
  });
  const signer = sf.createSigner({ web3Provider: provider });
  return { sf, signer };
};

const createFlow = async ({ provider, receiver }) => {
  const { sf, signer } = await getSuperfluid({ provider });
  const createFlowOperation = sf.cfaV1.createFlow({
    flowRate: process.env.REACT_APP_SUPERFLUID_FLOW_RATE,
    receiver,
    superToken: process.env.REACT_APP_USDCX_ADDRESS,
    overrides: {
      gasLimit: 300000,
    },
  });
  const result = await createFlowOperation.exec(signer);
  console.log(result);
};

const updateFlow = async ({ provider, receiver }) => {
  const { sf, signer } = await getSuperfluid({ provider });
  const createFlowOperation = sf.cfaV1.updateFlow({
    flowRate: process.env.REACT_APP_SUPERFLUID_FLOW_RATE,
    receiver,
    superToken: process.env.REACT_APP_USDCX_ADDRESS,
    overrides: {
      gasLimit: 300000,
    },
  });
  const result = await createFlowOperation.exec(signer);
  console.log(result);
};

export const createOrUpdateFlow = async ({ provider, sender, receiver }) => {
  const flow = await getFlow({ provider, sender, receiver });
  console.log(flow);
  if (flow.flowRate === "0") {
    await createFlow({ provider, receiver });
  } else {
    await updateFlow({ provider, receiver });
  }
};

export const deleteFlow = async ({ provider, sender, receiver }) => {
  const { sf, signer } = await getSuperfluid({ provider });

  const deleteFlowOperation = sf.cfaV1.deleteFlow({
    sender,
    receiver,
    superToken: process.env.REACT_APP_USDCX_ADDRESS,
  });
  console.log("Deleting your stream...");
  const result = await deleteFlowOperation.exec(signer);
  console.log(result);
};

export const getFlow = async ({ provider, sender, receiver }) => {
  const sf = await Framework.create({
    networkName: process.env.REACT_APP_NETWORK_NAME,
    provider: provider,
  });
  return await sf.cfaV1.getFlow({
    superToken: process.env.REACT_APP_USDCX_ADDRESS,
    sender,
    receiver,
    providerOrSigner: provider,
  });
};
