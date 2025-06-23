// SizeList.tsx
import {
  List, Datagrid, TextField, EditButton, ShowButton,
} from "react-admin";

export const SizeList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);
