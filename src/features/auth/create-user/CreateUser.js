import { useContext, useState } from "react";
import { Button, Group, TextInput, Box } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { ethers } from "ethers";

import { observer } from "mobx-react-lite";

import { createUser } from "../../../utils/aegis";
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
    if (!appStore.arcanaAccount) {
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
    <Box
      sx={(theme) => ({
        textAlign: "center",
        maxWidth: 500,
      })}
    >
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Group direction="column" position="center" grow={true}>
          <TextInput
            placeholder="Enter name/alias"
            required
            {...form.getInputProps("name")}
          />
          <Button position="right" type="submit" loading={creatingUser}>
            Create Account
          </Button>
        </Group>
      </form>
    </Box>
  );
});
