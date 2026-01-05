import React from "react";
import {
  BooleanInput,
  Edit,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
  useRedirect,
  useRefresh,
  useNotify,
  useGetList,
  useRecordContext,
} from "react-admin";

const tierChoices = [
  { id: "TIER1", name: "Tier 1" },
  { id: "TIER2", name: "Tier 2" },
  { id: "TIER3", name: "Tier 3" },
];

const TierConfigEdit: React.FC = (props) => {
  const redirect = useRedirect();
  const refresh = useRefresh();
  const notify = useNotify();
  const record = useRecordContext();
  const { data: existingConfigs = [] } = useGetList<any>("tier-config", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "tier", order: "ASC" },
    filter: {},
  });

  const usedTiers = new Set((existingConfigs as any[]).map((c) => c.tier));
  const choicesWithAvailability = tierChoices.map((choice) => ({
    ...choice,
    disabled: usedTiers.has(choice.id) && record?.tier !== choice.id,
  }));

  const transform = (data: any) => ({
    ...data,
    minPriceCents: data.minPriceReais
      ? Math.round(Number(data.minPriceReais) * 100)
      : 0,
  });

  return (
    <Edit
      {...props}
      transform={transform}
      mutationOptions={{
        onSuccess: () => {
          refresh();
          notify("Configuração atualizada", { type: "success" });
          redirect("list");
        },
        onError: (error: any) => {
          notify(error?.message || "Erro ao salvar configuração", { type: "error" });
        },
      }}
    >
      <SimpleForm redirect="list">
        <SelectInput
          source="tier"
          label="Tier"
          choices={choicesWithAvailability}
          validate={[required()]}
        />
        <NumberInput
          source="minPriceReais"
          label="Min price (R$)"
          min={0}
          validate={[required()]}
        />
        <TextInput source="currency" label="Currency" />
        <BooleanInput source="active" label="Active" />
      </SimpleForm>
    </Edit>
  );
};

export default TierConfigEdit;
