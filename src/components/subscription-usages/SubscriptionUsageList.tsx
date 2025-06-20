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
        <TextField source="name" />
      </ReferenceField>
      <NumberField source="currentMarketWithdrawalUsed" />
      <NumberField source="currentDonationWithdrawalUsed" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
);
