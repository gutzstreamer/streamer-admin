import React from "react";
import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  Filter,
  TextInput,
  NumberInput,
  SelectInput,
} from "react-admin";

const ProductFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="ID" source="id" alwaysOn />
    <TextInput label="Name" source="name" alwaysOn />
    <SelectInput
      label="Active"
      source="active"
      choices={[
        { id: true, name: "Yes" },
        { id: false, name: "No" },
      ]}
      emptyText="All"
    />
    <TextInput label="Gender" source="gender" />
    <TextInput label="cost" source="cost" />
    <TextInput label="ncm" source="ncm" />
    <NumberInput label="price" source="price" />
  </Filter>
);

const ProductList: React.FC = (props) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={<ProductFilter />}
    sort={{ field: "id", order: "DESC" }}
  >
    <Datagrid rowClick="show">
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



