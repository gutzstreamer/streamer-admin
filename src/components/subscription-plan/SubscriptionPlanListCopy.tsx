import { List, Datagrid, TextField, NumberField } from "react-admin";

import { ListProps } from "react-admin";

const SubscriptionPlanListCopy = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid>
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
