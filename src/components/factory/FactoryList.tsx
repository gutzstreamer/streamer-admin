import React from "react";
import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  DateInput,
  Filter,
  TextInput,
  SelectInput,
} from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const FactoryFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Dimona Order ID" source="dimonaOrderId" alwaysOn />
    <TextInput label="Order ID" source="orderId" />
    <TextInput label="Customer Name" source="customerName" />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
    <TextInput label="customerDocument" source="customerDocument" />
    <TextInput label="customerEmail" source="customerEmail" />
    <TextInput label="id" source="id" />
  </Filter>
);

export const FactoryList: React.FC = (props) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={<FactoryFilter />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="dimonaOrderId" />
      <DateField source="createdAt" />
      <ReferenceField source="orderId" reference="orders">
        <TextField source="id" />
      </ReferenceField>
      <TextField source="customerName" />
      <TextField source="customerDocument" />
      <TextField source="customerEmail" />
    </Datagrid>
  </List>
);





