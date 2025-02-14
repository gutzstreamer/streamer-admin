import { Edit, SimpleForm, TextInput, BooleanInput } from "react-admin";
import React from "react";

const FeatureToggleEdit: React.FC = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" />
      <BooleanInput source="active" />
    </SimpleForm>
  </Edit>
);

export default FeatureToggleEdit;
