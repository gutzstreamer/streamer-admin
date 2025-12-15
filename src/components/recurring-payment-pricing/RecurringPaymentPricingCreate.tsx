import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  BooleanInput,
  ReferenceInput,
  required,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";

const intervalChoices = [
  { id: "MONTHLY", name: "Mensal" },
  { id: "QUARTERLY", name: "Trimestral" },
  { id: "YEARLY", name: "Anual" },
];

const resourceTypeChoices = [
  { id: "SUBSCRIPTION_PLAN", name: "Plano de Assinatura" },
  { id: "STREAMER_MEMBERSHIP", name: "Membership de Streamer" },
  { id: "PREMIUM_FEATURE", name: "Feature Premium" },
  { id: "CUSTOM", name: "Personalizado" },
];

const ResourceIdField = () => {
  const resourceType = useWatch({ name: "resourceType" });

  if (resourceType === "SUBSCRIPTION_PLAN") {
    return (
      <ReferenceInput
        source="resourceId"
        reference="subscription-plan"
        label="Plano"
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
    );
  }

  return (
    <TextInput
      source="resourceId"
      disabled
      helperText="Funcionalidade ainda não disponível para este tipo de recurso"
    />
  );
};

const DurationDaysField = () => {
  const { setValue } = useFormContext();
  const interval = useWatch({ name: "interval" });

  const durationMap: Record<string, number> = {
    MONTHLY: 30,
    QUARTERLY: 90,
    YEARLY: 365,
  };

  const calculatedDays = durationMap[interval] || 30;

  useEffect(() => {
    setValue("durationDays", calculatedDays);
  }, [interval, calculatedDays, setValue]);

  const helperText =
    interval === "MONTHLY"
      ? "Mensal (30 dias)"
      : interval === "QUARTERLY"
        ? "Trimestral (90 dias)"
        : interval === "YEARLY"
          ? "Anual (365 dias)"
          : "";

  return (
    <NumberInput
      source="durationDays"
      label="Duração (dias)"
      validate={required()}
      readOnly
      helperText={`Calculado automaticamente: ${helperText}`}
    />
  );
};

export const RecurringPaymentPricingCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      {/* Tipo de Recurso */}
      <SelectInput
        source="resourceType"
        choices={resourceTypeChoices}
        validate={required()}
        defaultValue="SUBSCRIPTION_PLAN"
      />

      {/* Resource ID - UUID do recurso (plano, membership, etc) */}
      <ResourceIdField />

      {/* Nome do Pricing */}
      <TextInput source="name" validate={required()} />

      {/* Descrição */}
      <TextInput source="description" multiline rows={3} />

      {/* Preço */}
      <NumberInput source="price" label="Preço (R$)" validate={required()} />

      {/* Intervalo de Cobrança */}
      <SelectInput
        source="interval"
        choices={intervalChoices}
        validate={required()}
        defaultValue="MONTHLY"
      />

      {/* Duração em dias (calculado automaticamente) */}
      <DurationDaysField />

      {/* Status */}
      <BooleanInput source="isActive" defaultValue={true} />

      {/* Metadata (JSON) */}
      <TextInput
        source="metadata"
        multiline
        rows={3}
        helperText="JSON opcional"
      />
    </SimpleForm>
  </Create>
);

export default RecurringPaymentPricingCreate;
