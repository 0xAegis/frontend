import { useState, useContext } from "react";

import {
  ActionIcon,
  AppShell,
  Burger,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

import ConnectWallet from "../auth/connect-wallet/ConnectWallet";
import ConnectArcana from "../auth/connect-arcana/ConnectArcana";
import { AppContext } from "../..";
import styles from "./Navigation.module.css";

const Navigation = observer(({ children }) => {
  const [opened, setOpened] = useState(false);
  const appStore = useContext(AppContext);
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const navbarClassName =
    colorScheme === "light" ? styles.nav_link : styles.nav_link_dark;
  const dark = colorScheme === "dark";

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
            <Link className={navbarClassName} to={"/"}>
              Home
            </Link>
          </Navbar.Section>
          <Navbar.Section pb={20}>
            {appStore.user == null ? (
              <Link className={navbarClassName} to={"/create-account"}>
                Create Account
              </Link>
            ) : (
              <Link
                className={navbarClassName}
                to={"/user/" + appStore.user.id}
              >
                Profile
              </Link>
            )}
          </Navbar.Section>
          <Navbar.Section pb={20}>
            {appStore.user == null ? null : (
              <Link
                className={navbarClassName}
                to={"/user/" + appStore.user.id + "/supporters"}
              >
                Supporters
              </Link>
            )}
          </Navbar.Section>
          <Navbar.Section>
            {appStore.user == null ? null : (
              <Link
                className={navbarClassName}
                to={"/user/" + appStore.user.id + "/subscriptions"}
              >
                Subscriptions
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
          <Group position="apart">
            <Group>
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
            </Group>
            <ActionIcon
              variant="outline"
              color={dark ? "yellow" : "blue"}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </ActionIcon>
          </Group>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
});

export default Navigation;
