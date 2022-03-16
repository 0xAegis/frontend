import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { createUser } from "../../utils/aegis";
import { selectAccount } from "../connect-wallet/connectWalletSlice";

export const CreateUser = () => {
  const account = useSelector(selectAccount);

  const form = useForm({
    // The fields in the form
    initialValues: {
      username: "",
    },
  });

  // Callback which gets called when the form is submitted
  const handleFormSubmit = async (formValues) => {
    console.log(formValues);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const user = await createUser({
      provider,
      account,
      username: formValues.username,
    });
    console.log(user);
  };

  return (
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
