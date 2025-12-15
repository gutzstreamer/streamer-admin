import {
  Edit,
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
        disabled
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
    );
  }

  return (
    <TextInput
      source="resourceId"
      disabled
      helperText="Não editável"
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

  const helperText = interval === "MONTHLY"
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

export const RecurringPaymentPricingEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      {/* Tipo de Recurso (disabled - não deve ser editado) */}
      <SelectInput source="resourceType" choices={resourceTypeChoices} disabled />

      {/* Resource ID (disabled - não deve ser editado) */}
      <ResourceIdField />

      {/* Informações Editáveis */}
      <TextInput source="name" validate={required()} />
      <TextInput source="description" multiline rows={3} />

      <NumberInput
        source="price"
        label="Valor (R$)"
        validate={required()}
      />

      <SelectInput
        source="interval"
        choices={intervalChoices}
        validate={required()}
      />

      {/* Duração em dias (calculado automaticamente) */}
      <DurationDaysField />

      <BooleanInput source="isActive" />
    </SimpleForm>
  </Edit>
);

export default RecurringPaymentPricingEdit;
