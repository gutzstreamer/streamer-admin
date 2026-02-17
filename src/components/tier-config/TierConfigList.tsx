import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import {
  BooleanField,
  Datagrid,
  Filter,
  List,
  NumberField,
  SelectInput,
  TextField,
  TextInput,
} from "react-admin";

const TierConfigFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="ID" source="id" alwaysOn />
    <TextInput label="Tier" source="tier" />
    <TextInput label="Currency" source="currency" />
    <SelectInput
      label="Active"
      source="active"
      choices={[
        { id: true, name: "Yes" },
        { id: false, name: "No" },
      ]}
      emptyText="All"
    />
  </Filter>
);

const TierConfigList: React.FC = (props) => (
  <List
    pagination={<DefaultPagination />}
    {...props}
    perPage={25}
    filters={<TierConfigFilter />}
    sort={{ field: "id", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="tier" />
      <NumberField
        source="minPriceReais"
        label="Min price (R$)"
        options={{ minimumFractionDigits: 2 }}
      />
      <TextField source="currency" />
      <BooleanField source="active" />
    </Datagrid>
  </List>
);

export default TierConfigList;

