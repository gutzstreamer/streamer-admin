// GenderList.tsx
import {
  List, Datagrid, TextField, DateField, EditButton, ShowButton,
} from "react-admin";

export const GenderList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);
