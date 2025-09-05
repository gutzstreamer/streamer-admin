import React from "react";
import { List, Datagrid, TextField, NumberField, DateField } from "react-admin";

const CalculationFeeList: React.FC = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="name" label="Name" />
        <TextField source="description" label="Description" />
        <NumberField source="value" label="Value" />
        <TextField source="type" label="Type" />
        <TextField source="apply" label="Apply" />
        <DateField source="createdAt" label="Created At" />
        <DateField source="updatedAt" label="Updated At" />
      </Datagrid>
    </List>
  );
};

export default CalculationFeeList;