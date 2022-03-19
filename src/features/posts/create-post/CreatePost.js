import { useState, useContext } from "react";
import { Button, Checkbox, Group, Text, Textarea } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useForm } from "@mantine/hooks";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";

import { getArcanaStorage, uploadToArcana } from "../../../utils/arcana";
import { createPost } from "../../../utils/aegis";
import { AppContext } from "../../..";

// Wrapper over a form for creating posts on Aegis
export const CreatePost = observer(() => {
  const appStore = useContext(AppContext);
  //Keeping track of character count while writing post
  const [postContent, setPostContent] = useState("");
  const TextInputLimitCheck = (e) => {
    setPostContent(e.target.value);
  };

  // Use the useForm hook to create a form object
  const form = useForm({
    // The fields in the form
    initialValues: {
      text: "",
      attachments: [],
      isPaid: false,
    },
  });

  // Callback which gets called when the form is submitted
  const handleFormSubmit = async (formValues) => {
    console.log(formValues);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Upload the files to Arcana
    const arcanaStorage = getArcanaStorage({
      privateKey: appStore.arcanaAccount.privateKey,
      email: appStore.arcanaAccount.userInfo.email,
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
    const post = await createPost({
      provider,
      account: appStore.polygonAccount,
      text: formValues.text,
      attachments: fileDids,
      isPaid: formValues.isPaid,
    });
    console.log(post);
    // store the newly created post in Mobx store
    appStore.setPosts(appStore.posts.push(post));
  };

  // Callback which gets called after the user has selected or drag-and-dropped a file
  const handleDropzoneDrop = async (files) => {
    form.setFieldValue("attachments", files);
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Group direction="column" position="center" grow={true}>
        <Textarea
          onKeyUp={TextInputLimitCheck}
          minRows={4}
          maxRows={10}
          autosize
          required
          {...form.getInputProps("text")}
          styles={
            postContent.length > 256
              ? {
                  input: { color: "red" },
                }
              : null
          }
        />

        <Dropzone onDrop={handleDropzoneDrop} multiple={true}>
          {() => <Text>Drag image here or click to select file</Text>}
        </Dropzone>
        <Checkbox
          label="Is this a paid post?"
          {...form.getInputProps("isPaid")}
        />
        <Button position="right" type="submit">
          Post
        </Button>
      </Group>
    </form>
  );
});
