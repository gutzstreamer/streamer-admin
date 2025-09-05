import React from "react";
import { Create, SimpleForm, TextInput, NumberInput, SelectInput } from "react-admin";

const CalculationFeeCreate: React.FC = () => {
  return (
    <Create>
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
    </Create>
  );
};

export default CalculationFeeCreate;