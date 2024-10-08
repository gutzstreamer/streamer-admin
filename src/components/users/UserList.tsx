import { List, Datagrid, TextField, useDataProvider } from "react-admin";

import { ListProps } from "react-admin";

const UserList = (props: ListProps) => {
  const dataProvider = useDataProvider();

  return (
    <List {...props}>
      <Datagrid>
        <TextField source="name" />
        <TextField source="id" />
      </Datagrid>
    </List>
  );
};

export default UserList;
