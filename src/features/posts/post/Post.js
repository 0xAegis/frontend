import { Card, Text, Badge, Group, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export const Post = ({ text, attachments, isPaid }) => {
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
