import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  BooleanField,
  DateField,
  ReferenceField,
  SelectField,
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

export const RecurringPaymentPricingShow = (props: any) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />

      {/* Tipo e Recurso */}
      <SelectField source="resourceType" choices={resourceTypeChoices} />
      <ReferenceField
        source="resourceId"
        reference="subscription-plan"
        link="show"
      >
        <TextField source="name" />
      </ReferenceField>

      {/* Detalhes do Preço */}
      <TextField source="name" />
      <TextField source="description" />
      <NumberField
        source="price"
        options={{ style: "currency", currency: "BRL" }}
      />
      <TextField source="durationDays" label="Duração (dias)" />
      <SelectField source="interval" choices={intervalChoices} />

      {/* Status */}
      <BooleanField source="isActive" />

      {/* Datas */}
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </SimpleShowLayout>
  </Show>
);

export default RecurringPaymentPricingShow;
