import { useEffect, useContext, useState } from "react";

import { Link, useParams } from "react-router-dom";
import { Group, Text, Title, Loader, Button, Card } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";

import { getUserHasFollowerNft, getUser } from "../../../utils/aegis";
import { AppContext } from "../../..";
import { getReceivers } from "../../../utils/superfluid";

export const FollowedPage = observer(() => {
  const appStore = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [followedUsers, setFollowedUsers] = useState(null);
  const [followedUsersNames, setFollowedUsersNames] = useState(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      //Checking If connection status is false
      if (followedUsers === null) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let allNames = [];
      for (const followedUser of followedUsers) {
        const user = await getUser({ provider, account: followedUser });
        allNames.push(user.name);
      }
      setFollowedUsersNames(allNames);
    };
    getUserNames();
  }, [appStore.connectionStatus, followedUsers]);

  return loading ? (
    <Group direction="row">
      <Text size="xl">Loading...</Text>
      <Loader />
    </Group>
  ) : followedUsers !== null && followedUsersNames !== null ? (
    <div style={isMobile ? { width: "70vw" } : { width: 500 }}>
      <Group direction="column">
        {followedUsers.map((followedUser, index) => (
          <Card
            shadow="sm"
            p="lg"
            key={index}
            style={{
              overflowWrap: "anywhere",
              width: "100%",
              border: "1px solid black",
            }}
          >
            <Text size="xl">{followedUsersNames[index]}</Text>
            <Text color={"teal"}>{followedUser}</Text>
            <Group
              position={isMobile ? "center" : "right"}
              style={{ marginBottom: 5, marginTop: 5 }}
            >
              <Link to={"/user/" + followedUser}>
                <Button>View Profile</Button>
              </Link>
            </Group>
          </Card>
        ))}
      </Group>
    </div>
  ) : (
    <Title order={2}>No followed users.</Title>
  );
});
