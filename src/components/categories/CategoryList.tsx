import React from "react";
import {
  List,
  Datagrid,
  TextField
} from "react-admin";

const CategoryList: React.FC = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
    </Datagrid>
  </List>
);

export default CategoryList;
