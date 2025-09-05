import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  DateField,
  Filter,
  TextInput,
} from "react-admin";
import { ListProps } from "react-admin";

const WalletFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="User ID" source="userId" alwaysOn />
  </Filter>
);

const WalletList = (props: ListProps) => (
  <List {...props} filters={<WalletFilter />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="pixKey" />
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <NumberField
        source="balance"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <NumberField
        source="pendingBalance"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <TextField source="type" />
      <TextField source="currency" />
      <TextField source="status" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

export default WalletList;
