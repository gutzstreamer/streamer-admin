import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  DateInput,
  SelectField,
  NumberField,
  FunctionField,
  Filter,
  TextInput,
  SelectInput,
} from "react-admin";
import { ListProps } from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const statusChoices = [
  { id: "ACTIVE", name: "Ativa" },
  { id: "PENDING", name: "Pendente" },
  { id: "CANCELED", name: "Cancelada" },
  { id: "SUSPENDED", name: "Suspensa" },
];

const RecurringPaymentSubscriptionFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Subscription ID" source="id" alwaysOn />
    <TextInput label="User ID" source="userId" />
    <TextInput label="Pricing ID" source="pricingId" />
    <SelectInput
      label="Status"
      source="status"
      choices={statusChoices}
      emptyText="Todos"
    />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
  </Filter>
);

export const RecurringPaymentSubscriptionList = (props: ListProps) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={<RecurringPaymentSubscriptionFilter />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ReferenceField source="userId" reference="users" link="show">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField
        source="pricingId"
        reference="recurring-payment-pricing"
        link="show"
      >
        <TextField source="name" />
      </ReferenceField>
      <SelectField source="status" choices={statusChoices} />
      <DateField source="nextPaymentDate" />
      <DateField source="createdAt" />
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




