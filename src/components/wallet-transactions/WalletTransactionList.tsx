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

const WalletTransactionFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Wallet ID" source="walletId" alwaysOn />
  </Filter>
);

const WalletTransactionList = (props: ListProps) => (
  <List {...props} filters={<WalletTransactionFilter />}>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="walletId" reference="wallets">
        <TextField source="id" />
      </ReferenceField>
      <NumberField
        source="amount"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <TextField source="type" />
      <TextField source="status" />
      <TextField source="description" />
      <TextField source="txId" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

export default WalletTransactionList;
