import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  DateInput,
  SelectField,
  ReferenceField,
  Filter,
  TextInput,
  NumberInput,
  SelectInput,
} from "react-admin";
import { ListProps } from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const statusChoices = [
  { id: "PENDING", name: "Pendente" },
  { id: "CONFIRMED", name: "Confirmado" },
  { id: "FAILED", name: "Falhou" },
  { id: "CANCELED", name: "Cancelado" },
];

const RecurringPaymentTransactionFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Transaction ID" source="id" alwaysOn />
    <TextInput label="Subscription ID" source="subscriptionId" />
    <SelectInput
      label="Status"
      source="status"
      choices={statusChoices}
      emptyText="Todos"
    />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
    <NumberInput label="amount" source="amount" />
    <DateInput label="updatedAt" source="updatedAt" />
  </Filter>
);

export const RecurringPaymentTransactionList = (props: ListProps) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={<RecurringPaymentTransactionFilter />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ReferenceField
        source="subscriptionId"
        reference="recurring-payment-subscription"
        link="show"
      >
        <TextField source="id" />
      </ReferenceField>
      <NumberField
        source="amount"
        options={{ style: "currency", currency: "BRL" }}
        transform={(v: number) => v / 100}
      />
      <SelectField source="status" choices={statusChoices} />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
);

export default RecurringPaymentTransactionList;






