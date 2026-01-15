import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  BooleanField,
} from "react-admin";
import DonateShowActions from "./DonateShowActions";

const DonateShow: React.FC = (props) => (
  <Show {...props} actions={<DonateShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="streamerId" reference="streamers">
        <TextField source="name" />
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
      <TextField source="message" />
      <TextField source="username" />
      <BooleanField source="paid" label="Paga" />
      <ReferenceField
        source="transactionId"
        reference="wallet-transactions"
        label="Status da Transação"
      >
        <TextField source="status" />
      </ReferenceField>
      <TextField source="paymentCode" />
      <TextField source="qrCode" />
      <TextField source="transactionId" />
      <DateField source="createdAt" label="Created At" showTime />
    </SimpleShowLayout>
  </Show>
);

export default DonateShow;