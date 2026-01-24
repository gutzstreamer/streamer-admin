import React from "react";
import { BooleanInput, Edit, SimpleForm, TextInput } from "react-admin";
import StreamerImageInput from "./StreamerImageInput";

const StreamerEdit: React.FC = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="userId" />
      <TextInput source="bio" />
      <StreamerImageInput source="image" label="Streamer Profile Image" />
      <BooleanInput source="public" />
      <BooleanInput source="isFeatured" label="Featured Creator" />
    </SimpleForm>
  </Edit>
);

export default StreamerEdit;
