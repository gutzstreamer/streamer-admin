import React from "react";
import { BooleanInput, Edit, SimpleForm, TextInput } from "react-admin";

const StreamerEdit: React.FC = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="userId" />
      <TextInput source="bio" />
      <TextInput source="image" />
      <BooleanInput source="public" />
    </SimpleForm>
  </Edit>
);

export default StreamerEdit;
