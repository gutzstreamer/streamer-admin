import React from "react";
import { Datagrid, DateField, List, TextField } from "react-admin";

const StreamerRequestList: React.FC = (props) => (
  <List {...props} title="Streamer Requests">
      <Datagrid>
          <TextField source="id" />
          <TextField source="name" />
          <TextField source="email" />
          <TextField source="phone" />
          <TextField source="description" />
          <DateField source="createdAt" showTime />
          <DateField source="updatedAt" showTime />
          <TextField source="approved" />
      </Datagrid>
  </List>
)

export default StreamerRequestList;