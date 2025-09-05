import React from "react";
import { Edit, SimpleForm, TextInput, NumberInput, SelectInput } from "react-admin";

const CalculationFeeEdit: React.FC = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="name" label="Name" />
        <TextInput source="description" label="Description" />
        <NumberInput source="value" label="Value" />
        <SelectInput
          source="type"
          label="Type"
          choices={[
            { id: 'PERCENTAGE', name: 'Percentage' },
            { id: 'FIXED', name: 'Fixed' },
          ]}
        />
        <SelectInput
          source="apply"
          label="Apply"
          choices={[
            { id: 'PRODUCT', name: 'Product' },
            { id: 'SHIPPING', name: 'Shipping' },
            { id: 'TOTAL', name: 'Total' },
          ]}
        />
      </SimpleForm>
    </Edit>
  );
};

export default CalculationFeeEdit;