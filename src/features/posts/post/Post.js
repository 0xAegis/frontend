import { Card, Text, Badge, Group, useMantineTheme } from "@mantine/core";

export const Post = ({ text, attachments, isPaid }) => {
  // return <Text>{text}</Text>;
  const theme = useMantineTheme();

  return (
    <div style={{ width: 500, margin: "auto" }}>
      <Card shadow="sm" p="lg">
        <Text>{text}</Text>
        <Group
          position="right"
          style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
        >
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
