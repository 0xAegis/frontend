import { Button, Checkbox, Group, Text, Textarea } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useForm } from "@mantine/hooks";

import { getArcanaStorage, uploadToArcana } from "../../utils/arcana";

// Wrapper over a form for creating posts on Aegis
export const CreatePost = ({ arcanaAccount }) => {
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
