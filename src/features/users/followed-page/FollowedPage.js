import { useEffect, useContext, useState } from "react";

import { Link, useParams } from "react-router-dom";
import { Group, Text, Title, Loader, Button, Card } from "@mantine/core";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";

import { getUserHasFollowerNft } from "../../../utils/aegis";
import { AppContext } from "../../..";
import { getReceivers } from "../../../utils/superfluid";

export const FollowedPage = observer(() => {
  const appStore = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [followedUsers, setFollowedUsers] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      if (!window.ethereum) {
        console.log("Metamask is not installed.");
        return;
      }
      //Checking If connection status is false
      if (!appStore.connectionStatus) {
        return;
      }
      setLoading(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      try {
        const receivers = await getReceivers({
          provider,
          sender: params.userPubKey,
        });
        const results = await Promise.all(
          receivers.map((receiver) => {
            return getUserHasFollowerNft({
              provider,
              follower: params.userPubKey,
              followed: receiver,
            });
          })
        );
        let filteredReceivers = [];
        results.forEach((result, index) => {
          if (result) filteredReceivers.push(receivers[index]);
        });

        if (filteredReceivers.length !== 0) {
          setFollowedUsers(filteredReceivers);
        }
      } catch (err) {
        console.log("error :", err);
      }

      setLoading(false);
    };

    fetchFollowedUsers();
  }, [params.userPubKey, appStore.connectionStatus]);

  return loading ? (
    <Group direction="row">
      <Text size="xl">Loading...</Text>
      <Loader />
    </Group>
  ) : followedUsers !== null ? (
    <Group direction="column">
      {followedUsers.map((followedUser, index) => (
        <Card shadow="sm" p="lg" key={index}>
          <Text>{followedUser}</Text>
          <Group position="right" style={{ marginBottom: 5, marginTop: 5 }}>
            <Link to={"/user/" + followedUser}>
              <Button>View Profile</Button>
            </Link>
          </Group>
        </Card>
      ))}
    </Group>
  ) : (
    <Title order={2}>No followed users.</Title>
  );
});
