import React from "react";
import { Show, SimpleShowLayout, TextField } from "react-admin";

const UserShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="email" />
      <TextField source="phone" />
      <TextField source="identityNumber" />
      <TextField source="active" />
      <TextField source="blocked" />
    </SimpleShowLayout>
  </Show>
);

export default UserShow;
