import React from "react";
import { List, Datagrid, TextField, NumberField } from "react-admin";

const ProductList: React.FC = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="cost" />
      <TextField source="ncm" />
      <NumberField source="price" />
      <TextField source="gender" />
      <TextField source="active" />
    </Datagrid>
  </List>
);

export default ProductList;
