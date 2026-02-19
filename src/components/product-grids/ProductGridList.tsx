import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import { List, Datagrid, TextField, DeleteButton, Filter, TextInput } from "react-admin";

const ProductGridFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="ID" source="id" alwaysOn />
    <TextInput label="Name" source="name" alwaysOn />
    <TextInput label="URL" source="url" />
  </Filter>
);

const ProductGridList: React.FC = (props) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={<ProductGridFilter />}
    sort={{ field: "id", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="url" />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default ProductGridList;

