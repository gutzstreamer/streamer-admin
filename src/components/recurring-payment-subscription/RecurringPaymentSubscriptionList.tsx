import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  SelectField,
  NumberField,
  FunctionField,
} from "react-admin";
import { ListProps } from "react-admin";

const statusChoices = [
  { id: "ACTIVE", name: "Ativa" },
  { id: "PENDING", name: "Pendente" },
  { id: "CANCELED", name: "Cancelada" },
  { id: "SUSPENDED", name: "Suspensa" },
];

export const RecurringPaymentSubscriptionList = (props: ListProps) => (
  <List {...props}>
    <Datagrid rowClick="show">
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

      {/* Status */}
      <SelectField source="status" choices={statusChoices} />

      {/* Datas */}
      <DateField source="nextPaymentDate" />
      <DateField source="createdAt" />

      {/* Valor */}
      <FunctionField
        label="Valor"
        render={(record: any) => (
          <NumberField
            record={{ amount: record.pricing?.amount || 0 }}
            source="amount"
            options={{ style: "currency", currency: "BRL" }}
            transform={(v: number) => v / 100}
          />
        )}
      />
    </Datagrid>
  </List>
);

export default RecurringPaymentSubscriptionList;
