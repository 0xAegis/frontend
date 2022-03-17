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

import ConnectWallet from "../auth/connect-wallet/ConnectWallet";
import ConnectArcana from "../auth/connect-arcana/ConnectArcana";

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
          <Navbar.Section>
            <Text>Home</Text>
          </Navbar.Section>
          <Navbar.Section grow mt="md"></Navbar.Section>
          <Navbar.Section mb="xl">
            <ConnectWallet />
            <ConnectArcana />
          </Navbar.Section>
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
