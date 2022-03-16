import { useEffect } from "react";

import { Button, Group, Text } from "@mantine/core";
import { SocialLoginType } from "@arcana/auth";
import { useDispatch, useSelector } from "react-redux";

import { getArcanaAuth } from "../../../utils/arcana";
import { loginToArcana, selectArcanaUserInfo } from "../authSlice";

const ConnectArcana = () => {
  // Redux dispatcher
  const dispatch = useDispatch();
  // fetch account from the Redux store
  const account = useSelector(selectArcanaUserInfo);

  // Check if user is logged in to Arcana
  useEffect(() => {
    const arcanaAuth = getArcanaAuth({ baseUrl: window.location.origin });

    if (arcanaAuth.isLoggedIn()) {
      const userInfo = arcanaAuth.getUserInfo();
      dispatch(loginToArcana({ userInfo }));
    }
  }, [dispatch]);

  // Connect to Arcana using social auth
  const connectArcana = async () => {
    const arcanaAuth = getArcanaAuth({ baseUrl: window.location.origin });

    await arcanaAuth.loginWithSocial(SocialLoginType.google);
    if (arcanaAuth.isLoggedIn()) {
      const userInfo = arcanaAuth.getUserInfo();
      dispatch(loginToArcana({ userInfo }));
    }
  };

  return (
    <Group direction="column">
      <Group>
        {account ? (
          <Text>Connected to Arcana: {account.userInfo.email}</Text>
        ) : (
          <Button onClick={connectArcana}>Connect Arcana</Button>
        )}
      </Group>
    </Group>
  );
};

export default ConnectArcana;
