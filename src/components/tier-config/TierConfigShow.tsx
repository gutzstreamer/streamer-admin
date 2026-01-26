import React from "react";
import {
  BooleanField,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

const TierConfigShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="tier" />
      <NumberField source="minPriceReais" label="Min price (R$)" options={{ minimumFractionDigits: 2 }} />
      <TextField source="currency" />
      <BooleanField source="active" />
    </SimpleShowLayout>
  </Show>
);

export default TierConfigShow;
