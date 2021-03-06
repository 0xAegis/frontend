import { useEffect, useContext, useState } from "react";

import { Link, useParams } from "react-router-dom";
import { Group, Text, Title, Loader, Button, Card } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";

import { getUserHasFollowerNft, getUser } from "../../../utils/aegis";
import { AppContext } from "../../..";
import { getSenders } from "../../../utils/superfluid";

export const SupportersPage = observer(() => {
  const appStore = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [loadingUsername, setLoadingUsername] = useState(true);

  const [followers, setFollowers] = useState(null);
  const [followersNames, setFollowersNames] = useState(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const params = useParams();

  useEffect(() => {
    const fetchFollowers = async () => {
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
        const senders = await getSenders({
          provider,
          receiver: params.userPubKey,
        });
        const results = await Promise.all(
          senders.map((sender) => {
            return getUserHasFollowerNft({
              provider,
              follower: sender,
              followed: params.userPubKey,
            });
          })
        );
        let filteredSenders = [];
        results.forEach((result, index) => {
          if (result) filteredSenders.push(senders[index]);
        });

        if (filteredSenders.length !== 0) {
          setFollowers(filteredSenders);
        }
      } catch (err) {
        console.log("error :", err);
      }

      setLoading(false);
    };

    fetchFollowers();
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
      setLoadingUsername(true);
      try {
        if (followers === null) {
          throw new Error();
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let allNames = [];
        for (const follower of followers) {
          const user = await getUser({ provider, account: follower });
          allNames.push(user.name);
        }
        setFollowersNames(allNames);
      } catch {}
      setLoadingUsername(false);
    };
    getUserNames();
  }, [appStore.connectionStatus, followers]);

  return loading || loadingUsername ? (
    <Group direction="row">
      <Text size="xl">Loading...</Text>
      <Loader />
    </Group>
  ) : followers !== null && followersNames !== null ? (
    <div style={isMobile ? { width: "70vw" } : { width: 500 }}>
      <Group direction="column">
        {followers.map((follower, index) => (
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
            <Text size="xl">{followersNames[index]}</Text>
            <Text color={"teal"}>{follower}</Text>
            <Group
              position={isMobile ? "center" : "right"}
              style={{ marginBottom: 5, marginTop: 5 }}
            >
              <Link to={"/user/" + follower}>
                <Button>View Profile</Button>
              </Link>
            </Group>
          </Card>
        ))}
      </Group>
    </div>
  ) : (
    <Title order={2}>You don't have any supporters yet.</Title>
  );
});
