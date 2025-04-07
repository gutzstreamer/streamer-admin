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
        <TextField source="id" label="ID da Fatura" />
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
        <NumberField source="totalAmount" label="Valor Total" />
        <TextField source="accessKey" label="Chave de Acesso" />
        <TextField source="pdfUrl" label="URL do PDF" />
        <TextField source="operationType" label="Tipo de Operação" />
        <TextField source="issueType" label="Tipo de Emissão" />
      </Datagrid>
    </List>
  );
};

export default InvoiceList;
