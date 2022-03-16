import { Button, Checkbox, Group, Text, Textarea } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useForm } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";

import { getArcanaStorage, uploadToArcana } from "../../utils/arcana";
import { selectAccount as selectArcanaAccount } from "../connect-arcana/connectArcanaSlice";
import { selectAccount as selectPolygonAccount } from "../connect-wallet/connectWalletSlice";

// Wrapper over a form for creating posts on Aegis
export const CreatePost = () => {
  // Redux dispatcher
  const dispatch = useDispatch();
  // fetch account from the Redux store
  const arcanaAccount = useSelector(selectArcanaAccount);
  const polygonAccount = useSelector(selectPolygonAccount);

  // Use the useForm hook to create a form object
  const form = useForm({
    // The fields in the form
    initialValues: {
      text: "",
      attachments: [],
      ifPaid: false,
    },
  });

  // Callback which gets called when the form is submitted
  const handleFormSubmit = async (formValues) => {
    console.log(formValues);
    // Upload the files to Arcana
    const arcanaStorage = getArcanaStorage({
      privateKey: arcanaAccount.privateKey,
      email: arcanaAccount.userInfo.email,
    });
    const fileDids = await Promise.all(
      formValues.attachments.map(
        async (file) =>
          await uploadToArcana({
            arcanaStorage,
            file: file,
          })
      )
    );
    console.log("Attachments DIDs:", fileDids);
  };

  // Callback which gets called after the user has selected or drag-and-dropped a file
  const handleDropzoneDrop = async (files) => {
    form.setFieldValue("attachments", files);
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Group direction="column" position="center" grow={true}>
        <Textarea required {...form.getInputProps("text")} />
        <Dropzone onDrop={handleDropzoneDrop} multiple={true}>
          {() => <Text>Drag image here or click to select file</Text>}
        </Dropzone>
        <Checkbox
          label="Is this a paid post?"
          {...form.getInputProps("ifPaid")}
        />
        <Button position="right" type="submit">
          Post
        </Button>
      </Group>
    </form>
  );
};
