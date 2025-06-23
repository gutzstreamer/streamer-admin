import { List, Datagrid, TextField, BooleanField, DateField } from "react-admin";

// LIST VIEW
export const ProductList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <BooleanField source="active" />
      <TextField source="ncm" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

