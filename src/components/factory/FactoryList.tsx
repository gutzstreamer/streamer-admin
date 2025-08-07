import { List, Datagrid, TextField, ReferenceField, DateField } from "react-admin";
import React from "react";

export const FactoryList: React.FC = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="dimonaOrderId" />
      <DateField source="createdAt"  />
      <ReferenceField source="orderId" reference="orders">
        <TextField source="id" />
      </ReferenceField>
      <TextField source="customerName" />
      <TextField source="customerDocument" />
      <TextField source="customerEmail" />
    </Datagrid>
  </List>
);
