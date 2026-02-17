import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  DateInput,
  ReferenceField,
  TextInput,
  SelectInput,
} from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const subscriptionUsageFilters = [
  <TextInput key="id" label="Usage ID" source="id" alwaysOn />,
  <TextInput key="subscriptionId" label="Subscription ID" source="subscriptionId" />,
  <DatePresetInput key="datePreset" source="datePreset" label="Período" />, 
  <DateInput key="createdAt_gte" label="Created After" source="createdAt_gte" />,
  <DateInput key="createdAt_lte" label="Created Before" source="createdAt_lte" />,
];

export const SubscriptionUsageList = () => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    filters={subscriptionUsageFilters}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ReferenceField source="subscriptionId" reference="subscription">
        <TextField source="id" />
      </ReferenceField>
      <ReferenceField source="subscription.userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="subscription.planId" reference="subscription-plan">
        <TextField source="name" />
      </ReferenceField>
      <NumberField source="currentMarketWithdrawalUsed" />
      <NumberField source="currentDonationWithdrawalUsed" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
);



