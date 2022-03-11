import { AuthProvider } from "@arcana/auth";

export const getArcanaAuth = ({ baseUrl }) => {
  const redirectUri = new URL("oauth-redirect/google", baseUrl).href;
  return new AuthProvider({
    appID: process.env.REACT_APP_ARCANA_APP_ID,
    network: "testnet",
    oauthCreds: [
      {
        type: "google",
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      },
    ],
    flow: "popup",
    redirectUri,
  });
};
