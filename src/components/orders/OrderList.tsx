import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import {
  Datagrid,
  List,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
  Filter,
  SelectInput,
  TextInput,
  DateInput,
} from "react-admin";

import { statusOrderChoices } from "./index";
import { DatePresetInput } from "../common/DatePresetInput";

const OrderListFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Order ID" source="id" alwaysOn resettable />
    <TextInput label="User ID" source="userId" />
    <TextInput label="Payment Type" source="paymentType" />
    <SelectInput
      label="Current Status"
      source="status"
      choices={statusOrderChoices}
      alwaysOn
    />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Criado após" source="createdAt_gte" />
    <DateInput label="Criado antes" source="createdAt_lte" />
  </Filter>
);

const OrderList: React.FC = (props) => {
  return (
    <List
      perPage={25}
      pagination={<DefaultPagination />}
      {...props}
      filters={<OrderListFilter />}
      sort={{ field: "createdAt", order: "DESC" }}
    >
      <Datagrid rowClick="show">
        <TextField source="id" label="Order ID" />
        <ReferenceField source="userId" reference="users" label="User">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="paymentType" label="Payment Type" />
        <NumberField
          source="totalAmount"
          label="Total Amount"
          options={{ style: "currency", currency: "BRL" }}
          locales="pt-BR"
        />
        <NumberField
          source="totalAmountProducts"
          label="Total Products"
          options={{ style: "currency", currency: "BRL" }}
          locales="pt-BR"
        />
        <NumberField
          source="totalAmountShipping"
          label="Total Shipping"
          options={{ style: "currency", currency: "BRL" }}
          locales="pt-BR"
        />
        <TextField source="shippingSpeed" label="Shipping Speed" />
        <DateField source="createdAt" label="Created At" />
        <DateField source="updatedAt" label="Updated At" />
        <TextField source="currentStatus" label="Status" />
      </Datagrid>
    </List>
  );
};

export default OrderList;





