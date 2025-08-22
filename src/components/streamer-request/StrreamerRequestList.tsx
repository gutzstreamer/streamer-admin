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
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="atname" />
      <TextField source="name" />
      <TextField source="email" />
      <TextField source="phone" />
      <TextField source="status" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
);

export default StreamerRequestList;
