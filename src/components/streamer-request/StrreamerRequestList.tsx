import React from "react";
import {
  Datagrid,
  DateField,
  List,
  ReferenceField,
  TextField,
} from "react-admin";

const StreamerRequestList: React.FC = (props) => (
  <List {...props} title="Streamer Requests">
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="email" />
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="phone" />
      <TextField source="description" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
      <TextField source="approved" />
    </Datagrid>
  </List>
);

export default StreamerRequestList;
