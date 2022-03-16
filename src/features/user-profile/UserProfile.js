import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { Text } from "@mantine/core";
import { ethers } from "ethers";

import { getUser } from "../../utils/aegis";

export const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const userInfo = await getUser({ provider, account: params.username });
      setUserInfo(userInfo);
    };

    fetchUserInfo();
  }, [params.username]);

  return userInfo ? <Text>{userInfo.username}</Text> : <Text>not found</Text>;
};
