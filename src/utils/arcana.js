import { AuthProvider } from "@arcana/auth";
import { StorageProvider } from "@arcana/storage";

export const padPublicKey = (publicKey) => {
  return "0x04" + publicKey.X.padStart(64, "0") + publicKey.Y.padStart(64, "0");
};

// Util function for getting arcana auth object
export const getArcanaAuth = async ({ baseUrl }) => {
  const redirectUri = new URL("oauth-redirect/google", baseUrl).href;
  return await AuthProvider.init({
    appID: process.env.REACT_APP_ARCANA_APP_ID,
    redirectUri,
    flow: "popup",
  });
};

// Util function for getting arcana storage object
export const getArcanaStorage = ({ privateKey, email }) => {
  return new StorageProvider({
    appId: process.env.REACT_APP_ARCANA_APP_ID,
    privateKey,
    email,
  });
};

// Upload a file to Arcana
export const uploadToArcana = async ({ arcanaStorage, file }) => {
  const uploader = await arcanaStorage.getUploader();
  try {
    return await uploader.upload(file);
  } catch (error) {
    if (error.code === "TRANSACTION") {
      return error.message.substr(error.message.search("0x"), 66);
    }
    throw error;
  }
};

// Download a file from Arcana
export const downloadFromArcana = async ({ arcanaStorage, fileDid }) => {
  const downloader = await arcanaStorage.getDownloader();
  return downloader.download(fileDid);
};
