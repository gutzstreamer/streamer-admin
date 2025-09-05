import React from "react";
import {
  Datagrid,
  DateField,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";


const InvoiceList: React.FC = (props) => {
  return (
    <List {...props}>
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
