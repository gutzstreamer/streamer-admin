import React from "react";
import { DefaultPagination } from "../common/DefaultPagination";
import { List, Datagrid, TextField, Filter, TextInput } from "react-admin";

const CategoryFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="ID" source="id" alwaysOn />
    <TextInput label="Name" source="name" alwaysOn />
  </Filter>
);

const CategoryList: React.FC = (props) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={<CategoryFilter />}
    sort={{ field: "id", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
    </Datagrid>
  </List>
);

export default CategoryList;

