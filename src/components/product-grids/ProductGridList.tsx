import React from "react";
import { List, Datagrid, TextField, DeleteButton } from "react-admin";

const ProductGridList: React.FC = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="url" />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default ProductGridList;
