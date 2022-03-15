import { Group } from "@mantine/core";

import Navigation from "./components/navigation/Navigation";
import ConnectWallet from "./components/connect-wallet/ConnectWallet";
import ConnectArcana from "./components/arcana/connect-arcana/ConnectArcana";

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
    </Navigation>
  );
};

export default App;
