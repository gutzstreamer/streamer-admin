// Color resource - ColorList.tsx
import {
  List, Datagrid, TextField, EditButton, ShowButton,
} from "react-admin";

export const ColorList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="hex" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);
