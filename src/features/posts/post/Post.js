import { useEffect, useContext, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import {
  Card,
  Text,
  Badge,
  Group,
  useMantineTheme,
  Button,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { AppContext } from "../../..";
import { getUser } from "../../../utils/aegis";

export const Post = ({ user, text, attachments, isPaid }) => {
  const appStore = useContext(AppContext);
  const [userName, setUserName] = useState(null);
  useEffect(() => {
    const getUserNames = async () => {
      if (!window.ethereum) {
        console.log("Metamask is not installed.");
        return;
      }
      //Checking If connection status is false
      if (!appStore.connectionStatus) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const fetchedUser = await getUser({ provider, account: user });
      setUserName(fetchedUser.name);
    };
    getUserNames();
  }, [appStore.connectionStatus, user]);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div style={isMobile ? { width: "70vw" } : { width: 500 }}>
      <Card shadow="sm" p="lg">
        <Text>{text}</Text>

        <Group
          position="right"
          style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
        >
          <Link to={"/user/" + user}>
            <Button>{userName}</Button>
          </Link>
          {isPaid ? (
            <Badge color="blue" variant="light">
              Paid
            </Badge>
          ) : null}
        </Group>
      </Card>
    </div>
  );
};
