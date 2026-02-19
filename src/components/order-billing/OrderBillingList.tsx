import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  DateInput,
  NumberField,
  ReferenceField,
  ChipField,
  Filter,
  TextInput,
  NumberInput,
  SelectInput,
} from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const OrderBillingFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Billing ID" source="id" alwaysOn />
    <TextInput label="Order ID" source="orderId" />
    <TextInput label="Type" source="type" />
    <SelectInput
      label="Status"
      source="status"
      choices={[
        { id: "PENDING", name: "PENDING" },
        { id: "PAID", name: "PAID" },
        { id: "FAILED", name: "FAILED" },
        { id: "CANCELED", name: "CANCELED" },
      ]}
      emptyText="All"
    />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
    <NumberInput label="amount" source="amount" />
  </Filter>
);

export const OrderBillingList: React.FC = (props) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={<OrderBillingFilter />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" label="ID da CobranÃ§a" />
      <ReferenceField source="orderId" reference="orders" label="Pedido" link="show">
        <ChipField source="id" />
      </ReferenceField>
      <TextField source="status" label="Status" />
      <NumberField source="amount" label="Valor" />
      <TextField source="type" label="Tipo" />
      <DateField source="createdAt" label="Criado em" />
    </Datagrid>
  </List>
);






