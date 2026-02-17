import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  DateInput,
  Filter,
  TextInput,
  SelectInput,
} from "react-admin";
import React from "react";
import { DatePresetInput } from "../common/DatePresetInput";

const FeatureToggleFilter: React.FC = (props) => (
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
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Updated After" source="updatedAt_gte" />
    <DateInput label="Updated Before" source="updatedAt_lte" />
  </Filter>
);

const FeatureToggleList: React.FC = (props) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={<FeatureToggleFilter />}
    sort={{ field: "updatedAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <BooleanField source="active" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

export default FeatureToggleList;




