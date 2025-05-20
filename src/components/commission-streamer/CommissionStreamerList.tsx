import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
} from "react-admin";

const CommissionStreamerList: React.FC = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="streamerId" reference="streamers">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="orderId" reference="orders">
        <TextField source="id" />
      </ReferenceField>
      <TextField source="orderProductId" />
      <TextField source="taxComissionId" />
      <TextField source="commissionValue" />
      <TextField source="percentage" />
      <DateField source="createdAt" />
    </Datagrid>
  </List>
);

export default CommissionStreamerList;
