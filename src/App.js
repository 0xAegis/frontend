import { Group } from "@mantine/core";

import ConnectWallet from "./components/connect-wallet/ConnectWallet";
import ConnectArcana from "./components/arcana/connect-arcana/ConnectArcana";

const App = () => {
  return (
    <>
      <Group direction="column">
        <Group>
          <ConnectWallet />
        </Group>
        <Group>
          <ConnectArcana />
        </Group>
      </Group>
    </>
  );
};

export default App;
