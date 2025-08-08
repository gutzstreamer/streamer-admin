import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  Filter,
  TextInput,
  SelectInput,
  FunctionField,
  ChipField,
} from "react-admin";
import { ListProps } from "react-admin";

const originTypeChoices = [
  { id: 'WITHDRAWAL_REQUEST', name: 'Withdrawal Request' },
  { id: 'DONATION', name: 'Donation' },
  { id: 'ORDER_COMMISSION', name: 'Order Commission' },
  { id: 'PIX_PAYMENT', name: 'PIX Payment' },
  { id: 'MANUAL_ADJUSTMENT', name: 'Manual Adjustment' },
  { id: 'REFUND', name: 'Refund' },
  { id: 'UNKNOWN', name: 'Unknown' },
];

const statusChoices = [
  { id: 'PENDING', name: 'Pending' },
  { id: 'COMPLETED', name: 'Completed' },
  { id: 'FAILED', name: 'Failed' },
  { id: 'CANCELED', name: 'Canceled' },
  { id: 'REFUNDED', name: 'Refunded' },
];

const typeChoices = [
  { id: 'DEPOSIT', name: 'Deposit' },
  { id: 'WITHDRAW', name: 'Withdraw' },
];

const WalletTransactionFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Wallet ID" source="walletId" />
    <SelectInput label="Origin Type" source="originType" choices={originTypeChoices} />
    <TextInput label="Origin ID" source="originId" />
    <TextInput label="EFI Transaction ID" source="txId" />
    <SelectInput label="Status" source="status" choices={statusChoices} />
    <SelectInput label="Type" source="type" choices={typeChoices} />
  </Filter>
);

const WalletTransactionList = (props: ListProps) => (
  <List {...props} filters={<WalletTransactionFilter />}>
    <Datagrid>
      <TextField source="id" />
      <NumberField
        source="amount"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <ChipField source="type" />
      <ChipField source="status" />
      <TextField source="description" />
      <ChipField source="originType" label="Origin Type" />
      <FunctionField
        label="Origin ID"
        render={(record: any) => 
          record.originId ? (
            <span title={record.originId}>
              {record.originId.substring(0, 8)}...
            </span>
          ) : '-'
        }
      />
      <FunctionField
        label="EFI TX ID"
        render={(record: any) => 
          record.txId ? (
            <span title={record.txId}>
              {record.txId.substring(0, 8)}...
            </span>
          ) : '-'
        }
      />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
);

export default WalletTransactionList;
