import React from "react";
import {
  BooleanField,
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";

const SubscriptionPlanTierCommissionList: React.FC = (props) => (
  <List {...props} perPage={10}>
    <Datagrid rowClick="show">
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
    </Datagrid>
  </List>
);

export default SubscriptionPlanTierCommissionList;
