import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  SelectField,
  ReferenceField,
} from "react-admin";

const statusChoices = [
  { id: "PENDING", name: "Pendente" },
  { id: "CONFIRMED", name: "Confirmado" },
  { id: "FAILED", name: "Falhou" },
  { id: "CANCELED", name: "Cancelado" },
];

export const RecurringPaymentTransactionShow = (props: any) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />

      {/* Subscription */}
      <ReferenceField
        source="subscriptionId"
        reference="recurring-payment-subscription"
        link="show"
      >
        <TextField source="id" />
      </ReferenceField>

      {/* Detalhes da Transação */}
      <NumberField
        source="amount"
        options={{ style: "currency", currency: "BRL" }}
        transform={(v: number) => v / 100}
      />
      <SelectField source="status" choices={statusChoices} />
      <TextField source="paymentMethod" />
      <TextField source="transactionId" />
      <TextField source="errorMessage" />

      {/* Datas */}
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </SimpleShowLayout>
  </Show>
);

export default RecurringPaymentTransactionShow;
