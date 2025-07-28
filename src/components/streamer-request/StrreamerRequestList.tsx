import React from "react";
import { Datagrid, List, ReferenceField, TextField } from "react-admin";

const StreamerRequestList: React.FC = (props) => (
  <List {...props} title="Streamer Requests">
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="name" />
      <TextField source="email" />
      <TextField source="phone" />
      <TextField source="status" />
    </Datagrid>
  </List>
);

export default StreamerRequestList;
