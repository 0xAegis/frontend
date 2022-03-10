import { AuthProvider } from "@arcana/auth";
import { useEffect } from "react";

export const GoogleOauthRedirect = () => {
  useEffect(() => {
    const handleRedirect = async () => {
      AuthProvider.handleRedirectPage(window.location.origin);
    };
    handleRedirect();
  });
  return "redirecting...";
};
