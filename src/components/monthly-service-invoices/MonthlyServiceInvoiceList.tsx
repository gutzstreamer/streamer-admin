import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  ShowButton,
  Filter,
  TextInput,
  NumberInput,
} from "react-admin";

const MonthlyServiceInvoiceFilter: React.FC = (props) => (
  <Filter {...props}>
    <NumberInput label="Ano" source="year" alwaysOn />
    <NumberInput label="Mês" source="month" alwaysOn />
    <TextInput label="Streamer ID" source="streamerId" />
  </Filter>
);

const MonthlyServiceInvoiceList: React.FC = (props) => {
  return (
    <List {...props} filters={<MonthlyServiceInvoiceFilter />}>
      <Datagrid>
        <TextField source="id" />
        <NumberField source="year" label="Ano" />
        <NumberField source="month" label="Mês" />
        <ReferenceField source="streamerId" reference="streamers" label="Streamer">
          <TextField source="name" />
        </ReferenceField>
        <NumberField source="totalAmount" label="Total" options={{ style: 'currency', currency: 'BRL' }} />
        <NumberField source="totalFee" label="Taxa" options={{ style: 'currency', currency: 'BRL' }} />
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