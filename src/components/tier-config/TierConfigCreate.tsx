import React from "react";
import {
  BooleanInput,
  Create,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
  useRedirect,
  useRefresh,
  useNotify,
  useGetList,
} from "react-admin";

const tierChoices = [
  { id: "TIER1", name: "Tier 1" },
  { id: "TIER2", name: "Tier 2" },
  { id: "TIER3", name: "Tier 3" },
];

const TierConfigCreate: React.FC = (props) => {
  const redirect = useRedirect();
  const refresh = useRefresh();
  const notify = useNotify();
  const { data: existingConfigs = [] } = useGetList<any>("tier-config", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "tier", order: "ASC" },
    filter: {},
  });

  const usedTiers = new Set((existingConfigs as any[]).map((c) => c.tier));
  const availableChoices = tierChoices.map((choice) => ({
    ...choice,
    disabled: usedTiers.has(choice.id),
  }));

  const transform = (data: any) => ({
    ...data,
    minPriceCents: data.minPriceReais
      ? Math.round(Number(data.minPriceReais) * 100)
      : 0,
  });

  return (
    <Create
      {...props}
      transform={transform}
      mutationOptions={{
        onSuccess: () => {
          refresh();
          notify("Tier configurado com sucesso", { type: "success" });
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
          choices={availableChoices}
          validate={[required()]}
        />
        <NumberInput
          source="minPriceReais"
          label="Min price (R$)"
          min={0}
          validate={[required()]}
        />
        <TextInput source="currency" label="Currency" defaultValue="BRL" />
        <BooleanInput source="active" label="Active" defaultValue />
      </SimpleForm>
    </Create>
  );
};

export default TierConfigCreate;
