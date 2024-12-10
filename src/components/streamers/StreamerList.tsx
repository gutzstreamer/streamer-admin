import { List, Datagrid, TextField, useDataProvider } from "react-admin";

import { ListProps } from "react-admin";

const StreamerList = (props: ListProps) => {
  const dataProvider = useDataProvider();

  return <List {...props}>
  <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="userId" />
      <TextField source="bio" />
      <TextField source="image" />
  </Datagrid>
</List>
};

export default StreamerList;
