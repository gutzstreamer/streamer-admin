import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  ReferenceManyField,
  Datagrid,
  SelectField,
  BooleanField,
} from "react-admin";

const intervalChoices = [
  { id: "MONTHLY", name: "Mensal" },
  { id: "QUARTERLY", name: "Trimestral" },
  { id: "YEARLY", name: "Anual" },
];

const SubscriptionPlanShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <NumberField source="price" />
      <NumberField source="duration" />
      <NumberField source="donationFee" />
      <NumberField source="donationWithDrawallFee" />
      <NumberField source="donationWithDrawallLimit" />
      <NumberField source="marketWithDrawallFee" />
      <NumberField source="marketWithDrawallLimit" />

      {/* NOVO: Seção de Preços Recorrentes */}
      <ReferenceManyField
        label="Preços Recorrentes"
        reference="recurring-payment-pricing"
        target="resourceId"
        filter={{ resourceType: "SUBSCRIPTION_PLAN" }}
      >
        <Datagrid rowClick="show">
          <TextField source="name" />
          <SelectField source="interval" choices={intervalChoices} />
          <NumberField
            source="amount"
            options={{ style: "currency", currency: "BRL" }}
            transform={(v: number) => v / 100}
          />
          <BooleanField source="isActive" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);

export default SubscriptionPlanShow;

