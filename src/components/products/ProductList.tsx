import React from "react";
import { List, Datagrid, TextField, NumberField } from "react-admin";

const ProductList: React.FC = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <NumberField
        source="cost"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <NumberField
        source="price"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <TextField source="ncm" />
      <TextField source="gender" />
      <TextField source="active" />
    </Datagrid>
  </List>
);

export default ProductList;
