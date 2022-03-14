import { useState } from "react";

import { Group, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";

import { getArcanaStorage, uploadToArcana } from "../../../utils/arcana";

// Essentially a wrapper over a Mantine Dropzone component which handles file upload to Arcana
export const UploadFile = ({ arcanaAccount }) => {
  // Stores the DID of the file which was just uploaded
  const [uploadedDid, setUploadedDid] = useState(null);

  // This callback gets called after the user has selected or drag-and-dropped a file
  const handleDropzoneDrop = async (files) => {
    const arcanaStorage = getArcanaStorage({
      privateKey: arcanaAccount.privateKey,
      email: arcanaAccount.userInfo.email,
    });
    // Uploading the file to Arcana
    const did = await uploadToArcana({ arcanaStorage, file: files[0] });
    setUploadedDid(did);
  };

  return (
    <Group direction="column">
      <Dropzone onDrop={handleDropzoneDrop} multiple={false}>
        {() => <Text>Drag image here or click to select file</Text>}
      </Dropzone>
      {uploadedDid ? <Text>Just uploaded {uploadedDid}</Text> : null}
    </Group>
  );
};
