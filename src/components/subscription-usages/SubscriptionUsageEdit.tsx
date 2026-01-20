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
          optionText={(record) => {
            // Proteção contra dados undefined
            const planName = record?.plan?.name || "Sem plano";
            const userName = record?.user?.name || record?.user?.email || "Sem usuário";
            return `${planName} (${userName})`;
          }}
        />
      </ReferenceInput>
      <NumberInput source="currentMarketWithdrawalUsed" />
      <NumberInput source="currentDonationWithdrawalUsed" />
    </SimpleForm>
  </Edit>
);
