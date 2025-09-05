import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
} from "react-admin";
import React from "react";

const FeatureToggleList: React.FC = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <BooleanField source="active" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

export default FeatureToggleList;
