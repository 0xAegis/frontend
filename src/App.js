import { Group } from "@mantine/core";
import { Outlet } from "react-router-dom";

import ConnectArcana from "./features/auth/connect-arcana/ConnectArcana";
import ConnectWallet from "./features/auth/connect-wallet/ConnectWallet";
import Navigation from "./features/navigation/Navigation";

const App = () => {
  return (
    <Navigation>
      <Group direction="column">
        <Group>
          <ConnectWallet />
        </Group>
        <Group>
          <ConnectArcana />
        </Group>
      </Group>
      <Outlet />
    </Navigation>
  );
};

export default App;
