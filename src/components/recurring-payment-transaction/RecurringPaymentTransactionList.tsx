import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  SelectField,
  ReferenceField,
} from "react-admin";
import { ListProps } from "react-admin";

const statusChoices = [
  { id: "PENDING", name: "Pendente" },
  { id: "CONFIRMED", name: "Confirmado" },
  { id: "FAILED", name: "Falhou" },
  { id: "CANCELED", name: "Cancelado" },
];

export const RecurringPaymentTransactionList = (props: ListProps) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />

      {/* Subscription */}
      <ReferenceField
        source="subscriptionId"
        reference="recurring-payment-subscription"
        link="show"
      >
        <TextField source="id" />
      </ReferenceField>

      {/* Valor */}
      <NumberField
        source="amount"
        options={{ style: "currency", currency: "BRL" }}
        transform={(v: number) => v / 100}
      />

      {/* Status */}
      <SelectField source="status" choices={statusChoices} />

      {/* Data */}
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
);

export default RecurringPaymentTransactionList;
