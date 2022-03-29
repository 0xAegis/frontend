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
import { useNotifications } from "@mantine/notifications";

import { AppContext } from "../../..";
import { getUser } from "../../../utils/aegis";
import { getArcanaStorage, downloadFromArcana } from "../../../utils/arcana";
import styles from "./Post.module.css";

export const Post = ({ user, text, attachments, isPaid }) => {
  const appStore = useContext(AppContext);
  const notifications = useNotifications();
  const [userName, setUserName] = useState(null);
  useEffect(() => {
    console.log(attachments);
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
  }, [appStore.connectionStatus, user, attachments]);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleAttachmentDownload = async () => {
    if (!appStore.arcanaAccount) {
      notifications.showNotification({
        title: "Connect to Arcana",
        message:
          "You need to connect to Arcana before you can download attachments",
        color: "teal",
      });
      return;
    }

    // Download the files from Arcana
    const arcanaStorage = getArcanaStorage({
      privateKey: appStore.arcanaAccount.privateKey,
      email: appStore.arcanaAccount.userInfo.email,
    });
    await Promise.all(
      attachments.map(
        async (fileDid) =>
          await downloadFromArcana({
            arcanaStorage,
            fileDid: fileDid,
          })
      )
    );
  };

  return (
    <div style={isMobile ? { width: "70vw" } : { width: 500 }}>
      <Card shadow="sm" p="lg" withBorder>
        <Text>{text}</Text>
        <Group
          position="right"
          style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
        >
          {attachments.length ? (
            <Button onClick={handleAttachmentDownload}>
              Download Attachments
            </Button>
          ) : null}
        </Group>

        <Group
          position="apart"
          style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
        >
          <Link to={"/user/" + user} className={styles.link}>
            <Badge color="red" variant="light" className={styles.badge}>
              {userName}
            </Badge>
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
