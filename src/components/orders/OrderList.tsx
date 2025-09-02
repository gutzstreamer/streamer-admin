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
} from "react-admin";

import { statusOrderChoices } from "./index";

const OrderListFilter: React.FC = (props) => (
  <Filter {...props}>
    <SelectInput
      label="Current Status"
      source="status"
      choices={statusOrderChoices}
    />
  </Filter>
);

const OrderList: React.FC = (props) => {
  return (
    <List {...props} filters={<OrderListFilter />}>
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
        <TextField source="shippingSpeed" label="Shipping Spped" />
        <DateField source="createdAt" label="Created At" />
        <DateField source="updatedAt" label="Updated At" />
        <TextField source="currentStatus" label="Status" />
      </Datagrid>
    </List>
  );
};

export default OrderList;
