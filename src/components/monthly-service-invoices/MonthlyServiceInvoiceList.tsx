import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  DateInput,
  ReferenceField,
  ShowButton,
  Filter,
  TextInput,
  NumberInput,
  SelectInput,
} from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const MonthlyServiceInvoiceFilter: React.FC = (props) => (
  <Filter {...props}>
    <NumberInput label="Ano" source="year" alwaysOn />
    <NumberInput label="Mês" source="month" alwaysOn />
    <TextInput label="Streamer ID" source="streamerId" />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Criado após" source="createdAt_gte" />
    <DateInput label="Criado antes" source="createdAt_lte" />
    <TextInput label="id" source="id" />
    <TextInput label="month" source="month" />
    <TextInput label="name" source="name" />
    <NumberInput label="netAmount" source="netAmount" />
    <TextInput label="serviceInvoice.status" source="serviceInvoice.status" />
    <NumberInput label="totalAmount" source="totalAmount" />
    <TextInput label="totalFee" source="totalFee" />
    <TextInput label="withdrawalCount" source="withdrawalCount" />
    <TextInput label="year" source="year" />
  </Filter>
);

const MonthlyServiceInvoiceList: React.FC = (props) => {
  return (
    <List
      perPage={25}
      pagination={<DefaultPagination />}
      {...props}
      filters={<MonthlyServiceInvoiceFilter />}
      sort={{ field: "createdAt", order: "DESC" }}
    >
      <Datagrid>
        <TextField source="id" />
        <TextField source="year" label="Ano" />
        <TextField source="month" label="Mês" />
        <ReferenceField source="streamerId" reference="streamers" label="Streamer">
          <TextField source="name" />
        </ReferenceField>
        <NumberField source="totalAmount" label="Total" options={{ style: 'currency', currency: 'BRL' }} />
        <NumberField 
          source="totalFee" 
          label="?? Total da Nota Fiscal" 
          options={{ style: 'currency', currency: 'BRL' }} 
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        />
        <NumberField source="netAmount" label="Líquido" options={{ style: 'currency', currency: 'BRL' }} />
        <NumberField source="withdrawalCount" label="Qtd Saques" />
        <TextField source="serviceInvoice.status" label="Status NFS" />
        <DateField source="createdAt" label="Criado em" />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export default MonthlyServiceInvoiceList;






