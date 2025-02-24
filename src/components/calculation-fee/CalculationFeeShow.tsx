import React from "react";
import { Show, SimpleShowLayout, TextField, NumberField, DateField } from "react-admin";

const CalculationFeeShow: React.FC = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="name" label="Name" />
        <TextField source="description" label="Description" />
        <NumberField source="value" label="Value" />
        <TextField source="type" label="Type" />
        <TextField source="apply" label="Apply" />
        <DateField source="createdAt" label="Created At" />
        <DateField source="updatedAt" label="Updated At" />
      </SimpleShowLayout>
    </Show>
  );
};

export default CalculationFeeShow;