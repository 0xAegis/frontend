import { useEffect } from "react";

import { Button, Group, Text } from "@mantine/core";
import { SocialLoginType } from "@arcana/auth";
import { useDispatch, useSelector } from "react-redux";

<<<<<<< HEAD:src/features/auth/connect-arcana/ConnectArcana.js
import { getArcanaAuth } from "../../../utils/arcana";
import { loginToArcana, selectArcanaUserInfo } from "../authSlice";
=======
import { getArcanaAuth } from "../../utils/arcana";
import { changeAccount, selectAccount } from "./connectArcanaSlice";
>>>>>>> master:src/components/connect-arcana/ConnectArcana.js

const ConnectArcana = () => {
  // Redux dispatcher
  const dispatch = useDispatch();
  // fetch account from the Redux store
<<<<<<< HEAD:src/features/auth/connect-arcana/ConnectArcana.js
  const account = useSelector(selectArcanaUserInfo);
=======
  const account = useSelector(selectAccount);
>>>>>>> master:src/components/connect-arcana/ConnectArcana.js

  // Check if user is logged in to Arcana
  useEffect(() => {
    const arcanaAuth = getArcanaAuth({ baseUrl: window.location.origin });

    if (arcanaAuth.isLoggedIn()) {
      const userInfo = arcanaAuth.getUserInfo();
<<<<<<< HEAD:src/features/auth/connect-arcana/ConnectArcana.js
      dispatch(loginToArcana({ userInfo }));
=======
      dispatch(changeAccount({ userInfo }));
>>>>>>> master:src/components/connect-arcana/ConnectArcana.js
    }
  }, [dispatch]);

  // Connect to Arcana using social auth
  const connectArcana = async () => {
    const arcanaAuth = getArcanaAuth({ baseUrl: window.location.origin });

    await arcanaAuth.loginWithSocial(SocialLoginType.google);
    if (arcanaAuth.isLoggedIn()) {
      const userInfo = arcanaAuth.getUserInfo();
<<<<<<< HEAD:src/features/auth/connect-arcana/ConnectArcana.js
      dispatch(loginToArcana({ userInfo }));
=======
      dispatch(changeAccount({ userInfo }));
>>>>>>> master:src/components/connect-arcana/ConnectArcana.js
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
