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

const DonateFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Streamer ID" source="streamerId" alwaysOn />
  </Filter>
);

const DonateList = (props: ListProps) => (
  <List {...props} filters={<DonateFilter />}>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="streamerId" reference="streamers">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="transactionId" />
      <NumberField
        source="amount"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <TextField source="message" />
      <TextField source="username" />
      <TextField source="paymentCode" />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
);

export default DonateList;
