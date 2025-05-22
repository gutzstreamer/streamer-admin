import { List, Datagrid, TextField, ReferenceField } from "react-admin";
import React from "react";

export const FactoryList: React.FC = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="dimonaOrderId" />
      <ReferenceField source="orderId" reference="orders">
        <TextField source="id" />
      </ReferenceField>
      <TextField source="customerName" />
      <TextField source="customerDocument" />
      <TextField source="customerEmail" />
    </Datagrid>
  </List>
);
