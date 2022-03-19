import { Group } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";

import { CreateUser } from "./features/auth/create-user/CreateUser";
import Navigation from "./features/navigation/Navigation";
import { CreatePost } from "./features/posts/create-post/CreatePost";

const App = observer(({ appStore }) => {
  return (
    <Navigation appStore={appStore}>
      <Group direction="column">
        <CreatePost appStore={appStore} />
        <CreateUser appStore={appStore} />
      </Group>
      <Outlet />
    </Navigation>
  );
});

export default App;
