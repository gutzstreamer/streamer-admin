import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceField,
  DateField,
  SelectField,
  ReferenceManyField,
  Datagrid,
  NumberField,
} from "react-admin";

const statusChoices = [
  { id: "ACTIVE", name: "Ativa" },
  { id: "PENDING", name: "Pendente" },
  { id: "CANCELED", name: "Cancelada" },
  { id: "SUSPENDED", name: "Suspensa" },
];

const transactionStatusChoices = [
  { id: "PENDING", name: "Pendente" },
  { id: "CONFIRMED", name: "Confirmado" },
  { id: "FAILED", name: "Falhou" },
  { id: "CANCELED", name: "Cancelado" },
];

export const RecurringPaymentSubscriptionShow = (props: any) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />

      {/* Usuário */}
      <ReferenceField source="userId" reference="users" link="show">
        <TextField source="name" />
      </ReferenceField>

      {/* Pricing */}
      <ReferenceField
        source="pricingId"
        reference="recurring-payment-pricing"
        link="show"
      >
        <TextField source="name" />
      </ReferenceField>

      {/* Status e Datas */}
      <SelectField source="status" choices={statusChoices} />
      <DateField source="paymentDueDate" showTime />
      <DateField source="nextPaymentDate" showTime />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
      <DateField source="canceledAt" showTime />

      {/* Histórico de Transações */}
      <ReferenceManyField
        label="Transações"
        reference="recurring-payment-transaction"
        target="subscriptionId"
      >
        <Datagrid rowClick="show">
          <TextField source="id" />
          <NumberField
            source="amount"
            options={{ style: "currency", currency: "BRL" }}
            transform={(v: number) => v / 100}
          />
          <SelectField source="status" choices={transactionStatusChoices} />
          <DateField source="createdAt" showTime />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);

export default RecurringPaymentSubscriptionShow;
