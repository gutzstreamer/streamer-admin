import React from "react";
import { List, Datagrid, TextField, NumberField } from "react-admin";

const ProductList: React.FC = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="salePrice" />
      <NumberField source="suggestedPrice" />
      <TextField source="gender" />
      <TextField source="active" />
    </Datagrid>
  </List>
);

export default ProductList;
