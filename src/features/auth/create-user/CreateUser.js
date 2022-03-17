import { Button, Group, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, getUser } from "../../../utils/aegis";
import {
  loginToAegis,
  selectAegisUserInfo,
  selectPolygonAccount,
} from "../authSlice";

export const CreateUser = () => {
  const dispatch = useDispatch();
  const polygonAccount = useSelector(selectPolygonAccount);
  const aegisUserInfo = useSelector(selectAegisUserInfo);

  const form = useForm({
    // The fields in the form
    initialValues: {
      username: "",
    },
  });

  // On page load, check whether user has an account in Aegis
  useEffect(() => {
    const checkAegisAccount = async () => {
      if (!polygonAccount) {
        return;
      }
      if (!window.ethereum) {
        console.log("Metamask is not installed.");
        return;
      }
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const userInfo = await getUser({ provider, account: polygonAccount });
      console.log(userInfo);
      dispatch(loginToAegis({ userInfo }));
    };

    checkAegisAccount();
  }, [dispatch, polygonAccount]);

  // Callback which gets called when the form is submitted
  const handleFormSubmit = async (formValues) => {
    console.log(formValues);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const userInfo = await createUser({
      provider,
      account: polygonAccount,
      username: formValues.username,
    });
    console.log(userInfo);
    dispatch(loginToAegis({ userInfo }));
  };

  return aegisUserInfo ? (
    <Text>Logged in as: {aegisUserInfo.username}</Text>
  ) : (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Group direction="column" position="center" grow={true}>
        <TextInput required {...form.getInputProps("username")} />
        <Button position="right" type="submit">
          Create Account
        </Button>
      </Group>
    </form>
  );
};
