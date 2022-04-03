import { useState, useContext } from "react";
import {
  Button,
  Checkbox,
  Group,
  List,
  ListItem,
  Text,
  Textarea,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Dropzone } from "@mantine/dropzone";
import { useForm } from "@mantine/hooks";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";

import { getArcanaStorage, uploadToArcana } from "../../../utils/arcana";
import { createPost } from "../../../utils/aegis";
import { AppContext } from "../../..";
import { useNotifications } from "@mantine/notifications";
import { uploadToIpfs } from "../../../utils/ipfs";

// Wrapper over a form for creating posts on Aegis
export const CreatePost = observer(() => {
  const notifications = useNotifications();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const appStore = useContext(AppContext);
  //Keeping track of character count while writing post
  const [postContent, setPostContent] = useState("");
  const textLengthCheck = (e) => {
    setPostContent(e.target.value);
  };
  const [isPosting, setIsPosting] = useState(false);

  // Use the useForm hook to create a form object
  const form = useForm({
    // The fields in the form
    initialValues: {
      text: "",
      attachments: [],
      isPaid: false,
    },
    validate: {
      text: (value) =>
        value === ""
          ? "Post text can not be empty"
          : value.length > 256
          ? "Post text can be at most 256 characters"
          : null,
    },
  });

  // Callback which gets called when the form is submitted
  const handleFormSubmit = async (formValues) => {
    console.log(formValues);
    //Checking If connection status is false
    if (!window.ethereum) {
      console.log("Metamask is not installed.");
      return;
    }
    if (!appStore.connectionStatus) {
      return;
    }

    setIsPosting(true);
    let fileUris = [];

    // If there are attachments, upload them to Arcana or IPFS
    if (formValues.attachments.length) {
      if (formValues.isPaid) {
        if (!appStore.arcanaAccount) {
          notifications.showNotification({
            title: "Connect to Arcana",
            message:
              "You need to connect to Arcana before you can make posts with attachments",
            color: "teal",
          });
          return;
        }
        // Upload the files to Arcana
        const arcanaStorage = getArcanaStorage({
          privateKey: appStore.arcanaAccount.privateKey,
          email: appStore.arcanaAccount.userInfo.email,
        });
        const fileDids = await Promise.all(
          formValues.attachments.map(async (file) => {
            let did = null;
            while (!did) {
              try {
                did = await uploadToArcana({
                  arcanaStorage,
                  file: file,
                });
              } catch (error) {
                console.log("Failed to upload file, retrying: ", file.name);
              }
            }
            return did;
          })
        );
        fileUris = fileDids.map((did) => "arcana://" + did);
      } else {
        console.log("hello here");

        // Upload the files to IPFS
        const cid = await uploadToIpfs(formValues.attachments);
        fileUris = ["ipfs://" + cid];
      }
      console.log("Attachments URIs:", fileUris);
    }

    // Create the post on-chain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const post = await createPost({
        provider,
        account: appStore.polygonAccount,
        text: formValues.text,
        attachments: fileUris,
        isPaid: formValues.isPaid,
      });
      // store the newly created post in Mobx store
      appStore.setPosts(appStore.posts.push(post));
    } catch (error) {
      notifications.showNotification({
        title: "Transaction error",
        message: "Some error happened while creating blockchain transaction",
        color: "red",
      });
      setIsPosting(false);
      return;
    }
    setIsPosting(false);
    notifications.showNotification({
      title: "Post created",
      message: "You just created a post!",
    });
  };

  // Callback which gets called after the user has selected or drag-and-dropped a file
  const handleDropzoneDrop = async (files) => {
    form.setFieldValue("attachments", files);
  };

  return (
    <form
      style={isMobile ? { width: "70vw" } : { width: 500 }}
      onSubmit={form.onSubmit(handleFormSubmit)}
    >
      <Group direction="column" position="center" grow={true}>
        <Textarea
          placeholder="What's happening?"
          onKeyUp={textLengthCheck}
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
          {() => (
            <Group direction="column">
              <Text>Drag files here or click to select files</Text>
              {form.values.attachments.length ? (
                <Group direction="column">
                  <Text>Selected Files</Text>
                  <List>
                    {form.values.attachments.map((file) => (
                      <ListItem key={file.name}>{file.name}</ListItem>
                    ))}
                  </List>
                </Group>
              ) : null}
            </Group>
          )}
        </Dropzone>
        <Checkbox
          label="Is this a paid post?"
          {...form.getInputProps("isPaid")}
        />
        <Button position="right" type="submit" loading={isPosting}>
          Post
        </Button>
      </Group>
    </form>
  );
});
