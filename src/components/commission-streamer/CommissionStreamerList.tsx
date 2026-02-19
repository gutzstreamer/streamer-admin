import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  DateInput,
  NumberField,
  Filter,
  TextInput,
  SelectInput,
} from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const CommissionStreamerFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Commission ID" source="id" alwaysOn />
    <TextInput label="Streamer ID" source="streamerId" />
    <TextInput label="Order ID" source="orderId" />
    <TextInput label="Product Streamer ID" source="productStreamerId" />
    <TextInput label="Wallet Transaction ID" source="walletTransactionId" />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
    <TextInput label="commissionValue" source="commissionValue" />
    <TextInput label="name" source="name" />
    <TextInput label="percentage" source="percentage" />
    <TextInput label="productSalePrice" source="productSalePrice" />
    <TextInput label="productSaleQuantity" source="productSaleQuantity" />
    <TextInput label="status" source="status" />
  </Filter>
);

const CommissionStreamerList: React.FC = (props) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={<CommissionStreamerFilter />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ReferenceField source="streamerId" reference="streamers">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="orderId" reference="orders">
        <TextField source="id" />
      </ReferenceField>
      <ReferenceField source="productStreamerId" reference="product-streamer">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="walletTransactionId" reference="wallet-transactions">
        <TextField source="status" />
      </ReferenceField>
      <NumberField
        source="productSalePrice"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <TextField source="productSaleQuantity" />
      <TextField source="percentage" />
      <NumberField
        source="commissionValue"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
);

export default CommissionStreamerList;





