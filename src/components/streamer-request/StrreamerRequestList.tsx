import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import {
  Datagrid,
  DateInput,
  DateField,
  List,
  ReferenceField,
  TextField,
  TextInput,
  Filter,
  SelectInput,
} from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const StreamerRequestFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Request ID" source="id" alwaysOn />
    <TextInput label="Atname" source="atname" />
    <TextInput label="Referral Atname" source="referralAtname" />
    <TextInput label="Status" source="status" />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
  </Filter>
);

const StreamerRequestList: React.FC = (props) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    title="Streamer Requests"
    filters={<StreamerRequestFilter />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="atname" />
      <TextField source="name" />
      <TextField source="email" />
      <TextField source="phone" />
      <TextField source="referralAtname" />
      <TextField source="status" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
);

export default StreamerRequestList;





