import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceField,
  DateField,
} from "react-admin";

export const UserSubscriptionShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="userId" reference="users" />
      <ReferenceField source="planId" reference="subscription-plan" />
      <TextField source="status" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </SimpleShowLayout>
  </Show>
);
