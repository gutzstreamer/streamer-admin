import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
} from "react-admin";

const DonateShow: React.FC = (props) => (
  <Show {...props}>
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
      <TextField source="message" />
      <TextField source="username" />
      <TextField source="paymentCode" />
      <TextField source="qrCode" />
      <TextField source="transactionId" />
      <DateField source="createdAt" />
    </SimpleShowLayout>
  </Show>
);

export default DonateShow;
