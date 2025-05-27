import React from "react";
import { BooleanInput, Edit, SimpleForm, TextInput } from "react-admin";

const StreamerRequestEdit: React.FC = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="email" />
      <TextInput source="phone" />
      <TextInput source="description" />
      <BooleanInput source="approved" />
    </SimpleForm>
  </Edit>
);

export default StreamerRequestEdit;
