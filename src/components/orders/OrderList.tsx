import React from "react";
import { Datagrid, List, TextField, DateField, NumberField, FunctionField } from "react-admin";

const getLastOrderStatus = (record: any) => {
  if (!record.orderStatus || record.orderStatus.length === 0) return "";
  const latestStatus = record.orderStatus.reduce((latest: any, status: any) => {
    return new Date(status.createdAt) > new Date(latest.createdAt) ? status : latest;
  });
  return latestStatus.name;
};

const OrderList: React.FC = (props) => {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="id" label="Order ID" />
        <TextField source="userId" label="User ID" />
        <TextField source="paymentType" label="Payment Type" />
        <NumberField source="totalProducts" label="Total Products" />
        <DateField source="createdAt" label="Created At" />
        <DateField source="updatedAt" label="Updated At" />
        <FunctionField label="Order Status" render={getLastOrderStatus} />
      </Datagrid>
    </List>
  );
};

export default OrderList;