import React from "react";
import {
  Datagrid,
  List,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
} from "react-admin";


const OrderList: React.FC = (props) => {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="id" label="Order ID" />
        <ReferenceField source="userId" reference="users" label="User">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="paymentType" label="Payment Type" />
        <NumberField source="totalAmount" label="Total Amount" />
        <NumberField source="totalAmountProducts" label="Total Products" />
        <NumberField source="totalAmountShipping" label="Total Shipping" />
        <TextField source="shippingSpeed" label="Shipping Spped" />
        <DateField source="createdAt" label="Created At" />
        <DateField source="updatedAt" label="Updated At" />
        <TextField source="currentStatus" label="Status" />
      </Datagrid>
    </List>
  );
};

export default OrderList;
