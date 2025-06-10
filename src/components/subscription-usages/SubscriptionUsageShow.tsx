import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
} from "react-admin";

export const SubscriptionUsageShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField
        source="subscriptionId"
        reference="subscription"
        link="show"
      >
        <TextField source="id" />
      </ReferenceField>
      <NumberField source="currentStoreWithdrawalUsed" />
      <NumberField source="currentDonationWithdrawalUsed" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </SimpleShowLayout>
  </Show>
);
