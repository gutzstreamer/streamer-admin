import React from "react";
import { Edit, SelectInput, SimpleForm, TextInput } from "react-admin";
import { statusChoices } from ".";

const StreamerRequestEdit: React.FC = () => (
  <Edit>
    <SimpleForm>
      <SelectInput source="status" choices={statusChoices} />
      <TextInput source="reason" label="Nota do Administrador" multiline />
    </SimpleForm>
  </Edit>
);

export default StreamerRequestEdit;
