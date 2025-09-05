import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  Show,
  SimpleShowLayout,
  ImageField,
  ReferenceField,
  ChipField,
} from 'react-admin';

export const OrderBillingList: React.FC = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" label="ID da Cobrança" />
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
