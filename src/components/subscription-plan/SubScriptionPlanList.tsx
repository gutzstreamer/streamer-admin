import {
  List,
  Datagrid,
  TextField,
  NumberField,
} from "react-admin";

import { ListProps } from "react-admin";

const SubscriptionsPlanList = (props: ListProps) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="description" />
        <NumberField source="price" />
        <NumberField source="duration" />
        <NumberField source="commissionPlataform" />
        <NumberField source="commissionStreamer" />
        <NumberField source="donationFeeValue" />
        <NumberField source="storeFeeValue" />
        <NumberField source="allowedWithdrawals" />
        <NumberField source="withdrawalFeeValue" />
      </Datagrid>
    </List>
  );
};

export default SubscriptionsPlanList;
