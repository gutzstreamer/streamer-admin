import { DefaultPagination } from "../common/DefaultPagination";
import { List, Datagrid, TextField, DateField, DateInput, Filter, TextInput, SelectInput } from "react-admin";
import React from "react";
import { DatePresetInput } from "../common/DatePresetInput";

const ErrorLogFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="ID" source="id" alwaysOn />
    <TextInput label="Message" source="message" alwaysOn />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
  </Filter>
);

const ErrorLogList: React.FC = (props) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={<ErrorLogFilter />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="message" />
      <TextField source="stack" />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
);

export default ErrorLogList;




