import React from "react";
import {
  BooleanField,
  NumberField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

const SubscriptionPlanTierCommissionShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField
        source="subscriptionPlanId"
        reference="subscription-plan"
        label="Plano"
      >
        <TextField source="name" />
      </ReferenceField>
      <TextField source="tier" />
      <NumberField source="commissionPercent" label="Comissão (%)" />
      <BooleanField source="active" />
    </SimpleShowLayout>
  </Show>
);

export default SubscriptionPlanTierCommissionShow;
