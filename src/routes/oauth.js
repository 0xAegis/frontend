import { useEffect } from "react";

import { AuthProvider } from "@arcana/auth";

export const GoogleOauthRedirect = () => {
  useEffect(() => {
    const handleRedirect = async () => {
      AuthProvider.handleRedirectPage(window.location.origin);
    };
    handleRedirect();
  });
  return "redirecting...";
};
