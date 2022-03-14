import { useState, useEffect } from "react";

import { Button, Group, Text } from "@mantine/core";
import { SocialLoginType } from "@arcana/auth";

import { getArcanaAuth } from "../../../utils/arcana";

const ConnectArcana = () => {
  // The currently connected accounts
  const [arcanaAccount, setArcanaAccount] = useState(null);

  // Check if user is logged in to Arcana
  useEffect(() => {
    const arcanaAuth = getArcanaAuth({ baseUrl: window.location.origin });

    if (arcanaAuth.isLoggedIn()) {
      const userInfo = arcanaAuth.getUserInfo();
      setArcanaAccount(userInfo);
    }
  }, []);

  // Connect to Arcana using social auth
  const connectArcana = async () => {
    const arcanaAuth = getArcanaAuth({ baseUrl: window.location.origin });

    await arcanaAuth.loginWithSocial(SocialLoginType.google);
    if (arcanaAuth.isLoggedIn()) {
      const userInfo = arcanaAuth.getUserInfo();
      setArcanaAccount(userInfo);
    }
  };

  return (
    <Group direction="column">
      <Group>
        {arcanaAccount ? (
          <Text>Connected to Arcana: {arcanaAccount.userInfo.email}</Text>
        ) : (
          <Button onClick={connectArcana}>Connect Arcana</Button>
        )}
      </Group>
    </Group>
  );
};

export default ConnectArcana;
