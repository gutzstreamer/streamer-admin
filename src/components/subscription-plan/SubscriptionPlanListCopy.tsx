import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ListProps,
  Filter,
  TextInput,
} from "react-admin";

const SubscriptionPlanFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="ID" source="id" alwaysOn />
    <TextInput label="Name" source="name" alwaysOn />
  </Filter>
);

const SubscriptionPlanListCopy = (props: ListProps) => {
  return (
    <List
      perPage={25}
      pagination={<DefaultPagination />}
      {...props}
      filters={<SubscriptionPlanFilter />}
      sort={{ field: "id", order: "DESC" }}
    >
      <Datagrid rowClick="show">
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="description" />
        <NumberField source="price" />
        <NumberField source="duration" />
        <NumberField source="donationFee" />
        <NumberField source="donationWithDrawallFee" />
        <NumberField source="donationWithDrawallLimit" />
        <NumberField source="marketWithDrawallFee" />
        <NumberField source="marketWithDrawallLimit" />
      </Datagrid>
    </List>
  );
};

export default SubscriptionPlanListCopy;
