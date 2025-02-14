import {
    Create,
    SimpleForm,
    TextInput,
    BooleanInput,
  } from "react-admin";
  import React from "react";
  
  const FeatureToggleCreate: React.FC = (props) => (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="name" />
        <TextInput source="description" />
        <BooleanInput source="active" />
      </SimpleForm>
    </Create>
  );
  
  export default FeatureToggleCreate;