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
  const txReceipt = await createFlowOperation.exec(signer);
  await txReceipt.wait();
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
  const txReceipt = await createFlowOperation.exec(signer);
  await txReceipt.wait();
};

export const createOrUpdateFlow = async ({ provider, sender, receiver }) => {
  const flow = await getFlow({ provider, sender, receiver });
  console.log("Creating or updating the stream");
  if (flow.flowRate === "0") {
    await createFlow({ provider, receiver });
  } else {
    await updateFlow({ provider, receiver });
  }
  console.log("Done creating or updating the stream");
};

export const deleteFlow = async ({ provider, sender, receiver }) => {
  const { sf, signer } = await getSuperfluid({ provider });

  const deleteFlowOperation = sf.cfaV1.deleteFlow({
    sender,
    receiver,
    superToken: process.env.REACT_APP_USDCX_ADDRESS,
    overrides: {
      gasLimit: 300000,
    },
  });
  console.log("Deleting your stream...");
  const txReceipt = await deleteFlowOperation.exec(signer);
  await txReceipt.wait();
  console.log("Deleted the stream");
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

export const getSenders = async ({ provider, receiver }) => {
  const sf = await Framework.create({
    networkName: process.env.REACT_APP_NETWORK_NAME,
    provider: provider,
  });
  // Get all streams that are pouring USDCx into receiver
  const streams = await sf.query.listStreams({
    receiver,
    token: process.env.REACT_APP_USDCX_ADDRESS,
  });
  // Filter the streams having flowRate more than Aegis flowRate
  const nonZeroFlowRates = streams.data.filter(
    (stream) =>
      parseInt(stream.currentFlowRate) >=
      parseInt(process.env.REACT_APP_SUPERFLUID_FLOW_RATE)
  );
  // Get the senders of those flows
  const senders = nonZeroFlowRates.map((flow) => flow.sender);
  return senders;
};

export const getReceivers = async ({ provider, sender }) => {
  const sf = await Framework.create({
    networkName: process.env.REACT_APP_NETWORK_NAME,
    provider: provider,
  });
  // Get all streams that are sending USDCx out
  const streams = await sf.query.listStreams({
    sender,
    token: process.env.REACT_APP_USDCX_ADDRESS,
  });
  // Filter the streams having flowRate more than Aegis flowRate
  const nonZeroFlowRates = streams.data.filter(
    (stream) =>
      parseInt(stream.currentFlowRate) >=
      parseInt(process.env.REACT_APP_SUPERFLUID_FLOW_RATE)
  );
  // Get the receivers of those flows
  const receivers = nonZeroFlowRates.map((flow) => flow.receiver);
  return receivers;
};
