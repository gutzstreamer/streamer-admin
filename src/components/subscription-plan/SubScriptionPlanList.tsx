import { List, Datagrid, TextField, NumberField } from "react-admin";

import { ListProps } from "react-admin";

const SubscriptionPlanList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="description" />
            <NumberField source="price" />
            <NumberField source="duration" />
            <NumberField source="donationWithDrawallFee" />
            <NumberField source="donationWithDrawallLimit" />
            <NumberField source="storeWithDrawallFee" />
            <NumberField source="storeWithDrawallLimit" />
      </Datagrid>
    </List>
  );
};

export default SubscriptionPlanList;
