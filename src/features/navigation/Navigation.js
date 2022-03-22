import { useState, useContext } from "react";

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
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { AppContext } from "../..";
import styles from "./Navigation.module.css";

const Navigation = observer(({ children }) => {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const appStore = useContext(AppContext);
  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 250 }}
        >
          <Navbar.Section p={10}>
            <Link className={styles.nav_link} to={"/"}>
              Home
            </Link>
          </Navbar.Section>
          <Navbar.Section p={20}>
            {appStore.user == null ? (
              <Link className={styles.nav_link} to={"/create_account"} p={10}>
                Create Account
              </Link>
            ) : (
              <Link
                className={styles.nav_link}
                to={"/user/" + appStore.user.publicKey}
                pb={10}
              >
                Profile
              </Link>
            )}
          </Navbar.Section>
          <Navbar.Section grow mt="md"></Navbar.Section>
          <Navbar.Section mb="xl">
            <ConnectWallet pb={20} />
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
});

export default Navigation;
