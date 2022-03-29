import { useState, useContext } from "react";

import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  Title,
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
          width={{ sm: 250 }}
          style={{ width: 250 }}
        >
          <Navbar.Section pb={20}>
            <Link className={styles.nav_link} to={"/"}>
              Home
            </Link>
          </Navbar.Section>
          <Navbar.Section pb={20}>
            {appStore.user == null ? (
              <Link className={styles.nav_link} to={"/create-account"}>
                Create Account
              </Link>
            ) : (
              <Link
                className={styles.nav_link}
                to={"/user/" + appStore.user.publicKey}
              >
                Profile
              </Link>
            )}
          </Navbar.Section>
          <Navbar.Section pb={20}>
            {appStore.user == null ? null : (
              <Link
                className={styles.nav_link}
                to={"/user/" + appStore.user.publicKey + "/followers"}
              >
                Followers
              </Link>
            )}
          </Navbar.Section>
          <Navbar.Section>
            {appStore.user == null ? null : (
              <Link
                className={styles.nav_link}
                to={"/user/" + appStore.user.publicKey + "/following"}
              >
                Following
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
            <MediaQuery
              largerThan={"sm"}
              styles={{ display: "flex", paddingLeft: "65px" }}
            >
              <Title order={1}>Aegis</Title>
            </MediaQuery>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
});

export default Navigation;
