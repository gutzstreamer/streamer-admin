import { Create, SimpleForm, TextInput } from "react-admin";
import React from "react";

const CategoryCreate: React.FC = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" />
    </SimpleForm>
  </Create>
);

export default CategoryCreate;
