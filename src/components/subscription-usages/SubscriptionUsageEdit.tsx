import {
  Edit,
  SimpleForm,
  NumberInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";

export const SubscriptionUsageEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="subscriptionId" reference="subscription">
        <SelectInput
          optionText={(record) => `${record.plan.name} (${record.user.name})`}
        />
      </ReferenceInput>
      <NumberInput source="currentMarketWithdrawalUsed" />
      <NumberInput source="currentDonationWithdrawalUsed" />
    </SimpleForm>
  </Edit>
);
