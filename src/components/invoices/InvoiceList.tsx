import React from "react";
import { DefaultPagination } from "../common/DefaultPagination";
import {
  Datagrid,
  DateField,
  DateInput,
  List,
  NumberField,
  ReferenceField,
  TextField,
  Filter,
  TextInput,
  NumberInput,
  SelectInput,
} from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const InvoiceFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Order ID" source="orderId" alwaysOn />
    <TextInput label="Invoice Number" source="number" />
    <SelectInput
      label="Status"
      source="status"
      choices={[
        { id: "PENDING", name: "PENDING" },
        { id: "PROCESSING", name: "PROCESSING" },
        { id: "SUCCESS", name: "SUCCESS" },
        { id: "FAILED", name: "FAILED" },
      ]}
      emptyText="All"
    />
    <DatePresetInput source="datePreset" label="Per�odo" />
    <DateInput label="Issued After" source="issuedOn_gte" />
    <DateInput label="Issued Before" source="issuedOn_lte" />
    <TextInput label="accessKey" source="accessKey" />
    <TextInput label="environmentType" source="environmentType" />
    <TextInput label="id" source="id" />
    <TextInput label="model" source="model" />
    <TextInput label="series" source="series" />
    <NumberInput label="totalAmount" source="totalAmount" />
  </Filter>
);

const InvoiceList: React.FC = (props) => {
  return (
    <List
      perPage={25}
      pagination={<DefaultPagination />}
      {...props}
      filters={<InvoiceFilter />}
      sort={{ field: "issuedOn", order: "DESC" }}
    >
      <Datagrid rowClick="show">
        <ReferenceField
          source="orderId"
          reference="orders"
          label="Pedido"
          link="show"
        >
          <TextField source="id" label="ID do Pedido" />
        </ReferenceField>
        <TextField source="status" label="Status" />
        <TextField source="number" label="Número" />
        <TextField source="series" label="Série" />
        <TextField source="model" label="Modelo" />
        <TextField source="environmentType" label="Tipo de Ambiente" />
        <DateField source="issuedOn" label="Emitido em" />
        <NumberField
          source="totalAmount"
          label="Valor Total"
          options={{ style: "currency", currency: "BRL" }}
          locales="pt-BR"
        />
        <TextField source="accessKey" label="Chave de Acesso" />
      </Datagrid>
    </List>
  );
};

export default InvoiceList;






