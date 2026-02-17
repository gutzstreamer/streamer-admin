import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  DateInput,
  ShowButton,
  EditButton,
  Filter,
  TextInput,
  SelectInput,
} from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const UserSubscriptionFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Subscription ID" source="id" alwaysOn />
    <TextInput label="User ID" source="userId" />
    <TextInput label="Plan ID" source="planId" />
    <SelectInput
      label="Status"
      source="status"
      choices={[
        { id: "ACTIVE", name: "ACTIVE" },
        { id: "CANCELED", name: "CANCELED" },
        { id: "EXPIRED", name: "EXPIRED" },
        { id: "PENDING", name: "PENDING" },
      ]}
      emptyText="All"
    />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
  </Filter>
);

export const UserSubscriptionList = () => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    filters={<UserSubscriptionFilter />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ReferenceField source="userId" reference="users" />
      <ReferenceField source="planId" reference="subscription-plan" />
      <TextField source="status" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);




