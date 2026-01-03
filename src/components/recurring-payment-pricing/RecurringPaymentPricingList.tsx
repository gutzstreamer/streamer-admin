import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  DateField,
  SelectField,
  SelectInput,
  BooleanInput,
} from "react-admin";
import { ListProps } from "react-admin";

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

const pricingFilters = [
  <SelectInput
    key="resourceType"
    source="resourceType"
    choices={resourceTypeChoices}
    alwaysOn
  />,
  <SelectInput
    key="interval"
    source="interval"
    choices={intervalChoices}
    alwaysOn
  />,
  <BooleanInput key="isActive" source="isActive" alwaysOn />,
];

export const RecurringPaymentPricingList = (props: ListProps) => (
  <List {...props} filters={pricingFilters}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <SelectField source="resourceType" choices={resourceTypeChoices} />
      <SelectField source="interval" choices={intervalChoices} />
      <NumberField
        source="amount"
        options={{ style: "currency", currency: "BRL" }}
        transform={(value: number) => value / 100}
      />
      <BooleanField source="isActive" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
);

export default RecurringPaymentPricingList;
