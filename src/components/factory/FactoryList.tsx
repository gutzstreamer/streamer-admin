import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
} from "react-admin";
import React from "react";

export const FactoryList: React.FC = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="shippingSpeed" />
      <TextField source="deliveryMethodId" />
      <ReferenceField source="orderId" reference="orders">
        <TextField source="id" />
      </ReferenceField>
      <TextField source="customerName" />
      <TextField source="customerDocument" />
      <TextField source="customerEmail" />
      <ReferenceField source="orderNfeId" reference="invoices">
        <TextField source="id" />
      </ReferenceField>
      <ReferenceField source="addressId" reference="address">
        <TextField source="id" />
      </ReferenceField>
    </Datagrid>
  </List>
);
