import React from "react";
import {
  DateField,
  NumberField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

const InvoiceShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
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
      <DateField source="effectiveDate" label="Data de Efeito" />
      <TextField source="digestValue" label="Valor do Digest" />
      <NumberField source="totalAmount" label="Valor Total" />
      <TextField source="accessKey" label="Chave de Acesso" />
      <TextField source="pdfUrl" label="URL do PDF" />
      <TextField source="operationType" label="Tipo de Operação" />
      <TextField source="printingType" label="Tipo de Impressão" />
      <TextField source="issueType" label="Tipo de Emissão" />
      <TextField source="purposeType" label="Tipo de Finalidade" />
      <TextField source="receiverName" label="Nome do Destinatário" />
      <TextField source="receiverCPF" label="CPF do Destinatário" />
      <TextField source="receiverEmail" label="Email do Destinatário" />
      <TextField source="receiverAddress" label="Endereço do Destinatário" />
      <TextField source="receiverCity" label="Cidade do Destinatário" />
      <TextField source="receiverState" label="Estado do Destinatário" />
      <TextField source="receiverPostalCode" label="CEP do Destinatário" />
      <TextField source="receiverCountry" label="País do Destinatário" />
    </SimpleShowLayout>
  </Show>
);

export default InvoiceShow;
