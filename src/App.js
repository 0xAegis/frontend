import { Group } from "@mantine/core";

import Navigation from "./components/navigation/Navigation";
import ConnectWallet from "./components/connect-wallet/ConnectWallet";
import ConnectArcana from "./components/connect-arcana/ConnectArcana";
import { CreateUser } from "./components/create-user/CreateUser";

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
        <Group>
          <CreateUser />
        </Group>
      </Group>
    </Navigation>
  );
};

export default App;
