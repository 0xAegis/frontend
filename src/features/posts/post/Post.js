import { useContext } from "react";

import {
  Card,
  Text,
  Badge,
  Group,
  useMantineTheme,
  Button,
} from "@mantine/core";

import { getArcanaStorage, downloadFromArcana } from "../../../utils/arcana";
import { AppContext } from "../../..";
export const Post = ({ text, attachments, isPaid }) => {
  const appStore = useContext(AppContext);
  // return <Text>{text}</Text>;
  const theme = useMantineTheme();

  const handleAttachmentDownload = async () => {
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
    <div style={{ width: 500, margin: "auto" }}>
      <Card shadow="sm" p="lg">
        <Text>{text}</Text>
        <Group
          position="apart"
          style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
        >
          {isPaid ? (
            <Badge color="blue" variant="light">
              Paid
            </Badge>
          ) : null}
          <Button onClick={handleAttachmentDownload}>
            Download Attachments
          </Button>
        </Group>
      </Card>
    </div>
  );
};
