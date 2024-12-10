import {
  List,
  Datagrid,
  TextField,
  useDataProvider,
  NumberField,
} from "react-admin";

import { ListProps } from "react-admin";

const SubscriptionPlanList = (props: ListProps) => {
  const dataProvider = useDataProvider();

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

export default SubscriptionPlanList;
