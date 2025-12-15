import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  BooleanInput,
  required,
} from "react-admin";

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

export const RecurringPaymentPricingEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      {/* Tipo de Recurso (disabled - não deve ser editado) */}
      <SelectInput source="resourceType" choices={resourceTypeChoices} disabled />

      {/* Resource ID (disabled) */}
      <TextInput source="resourceId" disabled />

      {/* Informações Editáveis */}
      <TextInput source="name" validate={required()} />
      <TextInput source="description" multiline rows={3} />

      <NumberInput
        source="amount"
        label="Valor (R$)"
        validate={required()}
        format={(v: number) => v / 100}
        parse={(v: number) => Math.round(v * 100)}
      />

      <SelectInput
        source="interval"
        choices={intervalChoices}
        validate={required()}
      />

      <BooleanInput source="isActive" />
    </SimpleForm>
  </Edit>
);

export default RecurringPaymentPricingEdit;
