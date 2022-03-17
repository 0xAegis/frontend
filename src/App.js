import { Group } from "@mantine/core";
import { Outlet } from "react-router-dom";

import { CreateUser } from "./features/auth/create-user/CreateUser";
import Navigation from "./features/navigation/Navigation";

const App = () => {
  return (
    <Navigation>
      <Group direction="column">
        <Group>
          <CreateUser />
        </Group>
      </Group>
      <Outlet />
    </Navigation>
  );
};

export default App;
