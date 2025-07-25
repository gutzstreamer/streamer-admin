import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  NumberField,
} from "react-admin";

const CommissionStreamerList: React.FC = (props) => (
  <List {...props}>
    <Datagrid>
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
