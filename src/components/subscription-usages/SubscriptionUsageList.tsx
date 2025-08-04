import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
} from "react-admin";

export const SubscriptionUsageList = () => (
  <List>
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
