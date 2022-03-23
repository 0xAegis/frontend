import { useContext } from "react";
import { Button, Group, TextInput, Box } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { ethers } from "ethers";

import { observer } from "mobx-react-lite";

import { createUser } from "../../../utils/aegis";
import { AppContext } from "../../..";

export const CreateUser = observer(() => {
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

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const userInfo = await createUser({
      provider,
      account: appStore.polygonAccount,
      name: formValues.name,
    });
    console.log(userInfo);
    // Update Mobx Store
    appStore.setUser(userInfo);
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
          <TextInput required {...form.getInputProps("name")} />
          <Button position="right" type="submit">
            Create Account
          </Button>
        </Group>
      </form>
    </Box>
  );
});
