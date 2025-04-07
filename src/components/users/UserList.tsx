import { List, Datagrid, TextField } from "react-admin";

import { ListProps } from "react-admin";

const UserList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="name" />
        <TextField source="id" />
        <TextField source="email" />
        <TextField source="phone" />
        <TextField source="identityNumber" />
        <TextField source="active" />
      </Datagrid>
    </List>
  );
};

export default UserList;
