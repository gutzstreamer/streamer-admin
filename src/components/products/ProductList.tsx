import React from "react";
import { List, Datagrid, TextField, NumberField } from "react-admin";

const ProductList: React.FC = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="factoryName" />
      <NumberField source="salePrice" />
      <NumberField source="suggestedDiscountPrice" />
      <NumberField source="suggestedPrice" />
      <TextField source="gender" />
    </Datagrid>
  </List>
);

export default ProductList;
