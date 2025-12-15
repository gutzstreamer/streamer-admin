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

      {/* Vincular ao Subscription Plan (condicional) */}
      <ReferenceInput
        source="resourceId"
        reference="subscription-plan"
        label="Plano de Assinatura"
      >
        <SelectInput optionText="name" />
      </ReferenceInput>

      {/* Informações do Preço */}
      <TextInput source="name" validate={required()} />
      <TextInput source="description" multiline rows={3} />

      {/* Valor em REAIS (converter para centavos no transform) */}
      <NumberInput
        source="amount"
        label="Valor (R$)"
        validate={required()}
        format={(v: number) => v / 100}
        parse={(v: number) => Math.round(v * 100)}
      />

      {/* Intervalo de Cobrança */}
      <SelectInput
        source="interval"
        choices={intervalChoices}
        validate={required()}
        defaultValue="MONTHLY"
      />

      {/* Status */}
      <BooleanInput source="isActive" defaultValue={true} />
    </SimpleForm>
  </Create>
);

export default RecurringPaymentPricingCreate;
