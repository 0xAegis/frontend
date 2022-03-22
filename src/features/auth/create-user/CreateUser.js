import { useEffect, useContext, useState } from "react";
import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { ethers } from "ethers";

import { observer } from "mobx-react-lite";

import { createUser, getUser } from "../../../utils/aegis";
import { AppContext } from "../../..";
import { getArcanaAuth, padPublicKey } from "../../../utils/arcana";

export const CreateUser = observer(() => {
  const [creatingUser, setCreatingUser] = useState(false);
  const appStore = useContext(AppContext);
  const form = useForm({
    // The fields in the form
    initialValues: {
      name: "",
    },
  });

  // On page load, check whether user has an account in Aegis
  useEffect(() => {
    const checkAegisAccount = async () => {
      if (!window.ethereum) {
        console.log("Metamask is not installed.");
        return;
      }
      //Checking If connection status is false
      if (!appStore.connectionStatus) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const userInfo = await getUser({
        provider,
        account: appStore.polygonAccount,
      });
      console.log(userInfo);
      // Update Mobx Store
      appStore.setUser(userInfo);
    };

    checkAegisAccount();
  }, [appStore]);

  // Callback which gets called when the form is submitted
  const handleFormSubmit = async (formValues) => {
    console.log(formValues);
    if (!window.ethereum) {
      console.log("Metamask is not installed.");
      return;
    }
    //Checking If connection status is false
    if (!appStore.connectionStatus) {
      return;
    }
    if (!appStore.arcanaAccount.privateKey) {
      return;
    }

    setCreatingUser(true);

    try {
      // Get Arcana public key of the connected user
      const arcanaAuth = getArcanaAuth({ baseUrl: window.location.origin });
      const publicKeyCoords = await arcanaAuth.getPublicKey({
        verifier: appStore.arcanaAccount.loginType,
        id: appStore.arcanaAccount.userInfo.id,
      });
      const arcanaPublicKey = padPublicKey(publicKeyCoords);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const userInfo = await createUser({
        provider,
        account: appStore.polygonAccount,
        name: formValues.name,
        arcanaPublicKey,
      });
      console.log(userInfo);
      // Update Mobx Store
      appStore.setUser(userInfo);
    } catch (error) {
      console.log("Some error happened while creating user.");
    }

    setCreatingUser(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Group direction="column" position="center" grow={true}>
        <TextInput required {...form.getInputProps("name")} />
        <Button position="right" type="submit" loading={creatingUser}>
          Create Account
        </Button>
      </Group>
    </form>
  );
});
