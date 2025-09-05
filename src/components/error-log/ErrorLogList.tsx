import { List, Datagrid, TextField, DateField } from "react-admin";
import React from "react";

const ErrorLogList: React.FC = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="message" />
      <TextField source="stack" />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
);

export default ErrorLogList;