import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  DateInput,
  Filter,
  TextInput,
  SelectInput,
} from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const CalculationFeeFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Name" source="name" alwaysOn />
    <TextInput label="Type" source="type" />
    <TextInput label="Apply" source="apply" />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
    <TextInput label="description" source="description" />
    <DateInput label="updatedAt" source="updatedAt" />
    <TextInput label="value" source="value" />
  </Filter>
);

const CalculationFeeList: React.FC = () => {
  return (
    <List
      perPage={25}
      pagination={<DefaultPagination />}
      filters={<CalculationFeeFilter />}
      sort={{ field: "createdAt", order: "DESC" }}
    >
      <Datagrid rowClick="edit">
        <TextField source="name" label="Name" />
        <TextField source="description" label="Description" />
        <NumberField source="value" label="Value" />
        <TextField source="type" label="Type" />
        <TextField source="apply" label="Apply" />
        <DateField source="createdAt" label="Created At" />
        <DateField source="updatedAt" label="Updated At" />
      </Datagrid>
    </List>
  );
};

export default CalculationFeeList;





