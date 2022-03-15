import { useState } from "react";

import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  Text,
  useMantineTheme,
} from "@mantine/core";

const Navigation = ({ children }) => {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 250, lg: 300 }}
        >
          <Text>Home</Text>
        </Navbar>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Text size="lg">Aegis</Text>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

export default Navigation;
