import { useEffect } from "react";

import { Button, Container, Text } from "@mantine/core";
import { SocialLoginType } from "@arcana/auth";
import { observer } from "mobx-react-lite";

import { getArcanaAuth } from "../../../utils/arcana";

const ConnectArcana = observer(({ appStore }) => {
  // Check if user is logged in to Arcana
  useEffect(() => {
    const arcanaAuth = getArcanaAuth({ baseUrl: window.location.origin });

    if (arcanaAuth.isLoggedIn()) {
      const userInfo = arcanaAuth.getUserInfo();
      // Update changes to Mobx Store
      appStore.setArcanaAccount(userInfo);
    }
  }, [appStore]);

  // Connect to Arcana using social auth
  const connectArcana = async () => {
    const arcanaAuth = getArcanaAuth({ baseUrl: window.location.origin });

    await arcanaAuth.loginWithSocial(SocialLoginType.google);
    if (arcanaAuth.isLoggedIn()) {
      const userInfo = arcanaAuth.getUserInfo();
      // Update changes to Mobx Store
      appStore.setArcanaAccount(userInfo);
    }
  };

  return (
    <Container fluid>
      {appStore.arcanaAccount.userInfo ? (
        <Text>
          Connected to Arcana: {appStore.arcanaAccount.userInfo.email}
        </Text>
      ) : (
        <Button fullWidth onClick={connectArcana}>
          Connect Arcana
        </Button>
      )}
    </Container>
  );
});

export default ConnectArcana;
