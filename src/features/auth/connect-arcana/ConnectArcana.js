import { useEffect, useContext } from "react";

import { Button, Container, Text } from "@mantine/core";
import { SocialLoginType } from "@arcana/auth";
import { observer } from "mobx-react-lite";

import { getArcanaAuth } from "../../../utils/arcana";
import { AppContext } from "../../..";

const ConnectArcana = observer(() => {
  const appStore = useContext(AppContext);
  // Check if user is logged in to Arcana
  useEffect(() => {
    const checkArcana = async () => {
      const arcanaAuth = await getArcanaAuth({
        baseUrl: window.location.origin,
      });

      if (arcanaAuth.isLoggedIn()) {
        const userInfo = arcanaAuth.getUserInfo();
        // Update Mobx Store
        appStore.setArcanaAccount(userInfo);
      }
    };
    checkArcana();
  }, [appStore]);

  // Connect to Arcana using social auth
  const connectArcana = async () => {
    const arcanaAuth = await getArcanaAuth({ baseUrl: window.location.origin });

    await arcanaAuth.loginWithSocial(SocialLoginType.google);
    if (arcanaAuth.isLoggedIn()) {
      const userInfo = arcanaAuth.getUserInfo();
      // Update Mobx Store
      appStore.setArcanaAccount(userInfo);
    }
  };

  return (
    <Container fluid>
      {appStore.arcanaAccount ? (
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
