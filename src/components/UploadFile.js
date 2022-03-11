import { useState } from "react";

import { Group, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";

import { getArcanaStorage, uploadToArcana } from "../utils/arcana";

export const UploadFile = ({ arcanaAccount }) => {
  const [uploadedDid, setUploadedDid] = useState(null);

  const handleDropzoneDrop = async (files) => {
    const arcanaStorage = getArcanaStorage({
      privateKey: arcanaAccount.privateKey,
      email: arcanaAccount.userInfo.email,
    });
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
