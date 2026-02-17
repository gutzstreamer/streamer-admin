import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import {
  BooleanField,
  Datagrid,
  DateInput,
  DateField,
  List,
  NumberField,
  TextField,
  Filter,
  TextInput,
  SelectInput,
} from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const PlatformBenefitFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="ID" source="id" alwaysOn />
    <TextInput label="Tier" source="tier" />
    <TextInput label="Type" source="type" />
    <TextInput label="Name" source="name" />
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
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
  </Filter>
);

const PlatformBenefitList: React.FC = (props) => (
  <List
    pagination={<DefaultPagination />}
    {...props}
    perPage={25}
    filters={<PlatformBenefitFilter />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="tier" />
      <TextField source="type" />
      <TextField source="name" />
      <TextField source="description" />
      <NumberField source="limitPerCycle" />
      <NumberField source="expiresAfterDays" />
      <BooleanField source="active" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
);

export default PlatformBenefitList;




