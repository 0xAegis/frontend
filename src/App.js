import { Group } from "@mantine/core";

import ConnectArcana from "./features/auth/connect-arcana/ConnectArcana";
import ConnectWallet from "./features/auth/connect-wallet/ConnectWallet";
import { CreateUser } from "./features/auth/create-user/CreateUser";
import Navigation from "./features/navigation/Navigation";
import { CreatePost } from "./features/posts/create-post/CreatePost";

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
          <CreatePost />
          <CreateUser />
        </Group>
      </Group>
    </Navigation>
  );
};

export default App;
