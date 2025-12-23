import {
  Create,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  required,
} from 'react-admin';

export const ProductKeyCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput
        source="configId"
        reference="virtual-product-key-configs"
        label="Product Key Config"
        validate={[required()]}
      >
        <SelectInput optionText="id" />
      </ReferenceInput>

      <ArrayInput source="keyValues" label="Product Keys" validate={[required()]}>
        <SimpleFormIterator inline>
          <TextInput 
            source="." 
            label="Key" 
            helperText="Enter product key (e.g., XXXXX-XXXXX-XXXXX)"
            validate={[required()]}
          />
        </SimpleFormIterator>
      </ArrayInput>

      <TextInput
        source="status"
        defaultValue="AVAILABLE"
        disabled
        helperText="Status is automatically set to AVAILABLE"
      />
    </SimpleForm>
  </Create>
);
