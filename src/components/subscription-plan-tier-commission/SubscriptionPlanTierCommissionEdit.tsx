import React from "react";
import {
  BooleanInput,
  Edit,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  required,
  useNotify,
  useRedirect,
  useRefresh,
} from "react-admin";

const tierChoices = [
  { id: "TIER1", name: "Tier 1" },
  { id: "TIER2", name: "Tier 2" },
  { id: "TIER3", name: "Tier 3" },
];

const SubscriptionPlanTierCommissionEdit: React.FC = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const refresh = useRefresh();

  return (
    <Edit
      {...props}
      mutationOptions={{
        onSuccess: () => {
          refresh();
          notify("Comissão atualizada", { type: "success" });
          redirect("list", "subscription-plan-tier-commission");
        },
        onError: (error: any) => {
          notify(error?.message || "Erro ao salvar comissão", { type: "error" });
        },
      }}
    >
      <SimpleForm redirect="list">
        <ReferenceInput
          source="subscriptionPlanId"
          reference="subscription-plan"
          label="Plano"
        >
          <SelectInput optionText="name" validate={[required()]} />
        </ReferenceInput>
        <SelectInput
          source="tier"
          label="Tier"
          choices={tierChoices}
          validate={[required()]}
        />
        <NumberInput
          source="commissionPercent"
          label="Comissão (%)"
          min={0}
          max={100}
          step={0.1}
          validate={[required()]}
        />
        <BooleanInput source="active" label="Active" />
      </SimpleForm>
    </Edit>
  );
};

export default SubscriptionPlanTierCommissionEdit;
