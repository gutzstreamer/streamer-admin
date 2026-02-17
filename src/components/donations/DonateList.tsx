import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  DateField,
  DateInput,
  Filter,
  TextInput,
  NumberInput,
  BooleanField,
  SelectInput,
} from "react-admin";
import { ListProps } from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const DonateFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Donation ID" source="id" alwaysOn />
    <TextInput label="Streamer ID" source="streamerId" alwaysOn />
    <TextInput label="Username" source="username" />
    <TextInput label="Transaction ID" source="transactionId" />
    <SelectInput
      label="Paid"
      source="paid"
      choices={[
        { id: true, name: "Yes" },
        { id: false, name: "No" },
      ]}
      emptyText="All"
    />
    <SelectInput
      label="Skip Alert"
      source="skipAlert"
      choices={[
        { id: true, name: "Yes" },
        { id: false, name: "No" },
      ]}
      emptyText="All"
    />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
    <NumberInput label="amount" source="amount" />
    <NumberInput label="fee" source="fee" />
    <TextInput label="name" source="name" />
    <NumberInput label="netAmount" source="netAmount" />
    <TextInput label="status" source="status" />
  </Filter>
);

const DonateList = (props: ListProps) => {
  return (
    <List
      perPage={25}
      pagination={<DefaultPagination />}
      {...props}
      filters={<DonateFilter />}
      sort={{ field: "createdAt", order: "DESC" }}
    >
      <Datagrid rowClick="show">
        <TextField source="id" />
        <ReferenceField source="streamerId" reference="streamers">
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField source="transactionId" reference="wallet-transactions">
          <TextField source="status" />
        </ReferenceField>
        <NumberField
          source="amount"
          options={{ style: "currency", currency: "BRL" }}
          locales="pt-BR"
        />
        <NumberField source="fee" locales="pt-BR" />
        <NumberField
          source="netAmount"
          options={{ style: "currency", currency: "BRL" }}
          locales="pt-BR"
        />
        <BooleanField source="paid" />
        <BooleanField source="skipAlert" />
        <TextField source="status" />
        <TextField source="username" />
        <DateField source="createdAt" label="Created At" showTime />
      </Datagrid>
    </List>
  );
};

export default DonateList;







