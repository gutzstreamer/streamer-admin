import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import {
  BooleanField,
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
  Filter,
  TextInput,
  NumberInput,
  SelectInput,
} from "react-admin";

const SubscriptionPlanTierCommissionFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="ID" source="id" alwaysOn />
    <TextInput label="Plano ID" source="subscriptionPlanId" />
    <TextInput label="Tier" source="tier" />
    <SelectInput
      label="Ativo"
      source="active"
      choices={[
        { id: true, name: "Yes" },
        { id: false, name: "No" },
      ]}
      emptyText="All"
    />
    <NumberInput label="commissionPercent" source="commissionPercent" />
    <TextInput label="name" source="name" />
  </Filter>
);

const SubscriptionPlanTierCommissionList: React.FC = (props) => (
  <List
    pagination={<DefaultPagination />}
    {...props}
    perPage={25}
    filters={<SubscriptionPlanTierCommissionFilter />}
    sort={{ field: "id", order: "DESC" }}
  >
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



