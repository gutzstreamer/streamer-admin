import React from "react";
import {
  Edit,
  TextInput,
  NumberInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ArrayInput,
  SimpleFormIterator,
  TabbedForm,
  FormTab,
  required,
  ReferenceInput,
  BooleanInput,
} from "react-admin";

const ProductEdit: React.FC = (props) => {
  return (
    <Edit {...props}>
      <TabbedForm>
        {/* General Info */}
        <FormTab label="General">
          <TextInput source="name" validate={required()} />
          <TextInput multiline source="description" />
          <TextInput source="ncm" validate={required()} />
          <BooleanInput source="active" label="Active" defaultValue={true} />
          <ReferenceArrayInput source="categories" reference="categories">
            <SelectArrayInput optionText="name" />
          </ReferenceArrayInput>
        </FormTab>

        {/* Images */}
        <FormTab label="Images">
          <ArrayInput source="images">
            <SimpleFormIterator>
              <TextInput source="url" label="Image URL" validate={required()} />
              <ReferenceInput source="colorId" reference="colors" label="Color">
                <SelectInput optionText="name" />
              </ReferenceInput>
            </SimpleFormIterator>
          </ArrayInput>
        </FormTab>

        {/* Tax Commissions */}
        <FormTab label="Tax Commissions">
          <ArrayInput source="taxComissions">
            <SimpleFormIterator>
              <TextInput source="name" label="Name" validate={required()} />
              <NumberInput source="value" label="Value" validate={required()} />
              <ReferenceInput
                label="Subscription Plan"
                source="subscriptionPlanId"
                reference="subscription-plan"
                format={(value) => value?.id}
                parse={(value) => value}
              >
                <SelectInput optionText="name" />
              </ReferenceInput>
            </SimpleFormIterator>
          </ArrayInput>
        </FormTab>

        {/* Variants */}
        <FormTab label="Variants">
          <ArrayInput source="variants">
            <SimpleFormIterator>
              <TextInput source="sku" label="SKU" validate={required()} />
              <NumberInput source="price" label="Price" validate={required()} />
              <NumberInput source="cost" label="Cost" validate={required()} />
              <ReferenceInput source="colorId" reference="colors" label="Color">
                <SelectInput optionText="name" />
              </ReferenceInput>
              <ReferenceInput source="sizeId" reference="sizes" label="Size">
                <SelectInput optionText="name" />
              </ReferenceInput>
              <ReferenceInput
                source="genderId"
                reference="genders"
                label="Gender"
              >
                <SelectInput optionText="name" />
              </ReferenceInput>
              <TextInput
                source="dimonaMapping.dimonaSku"
                label="Dimona SKU"
                validate={required()}
              />
              <TextInput
                source="dimonaMapping.factoryProduct.name"
                label="Factory Product Name"
                validate={required()}
              />
            </SimpleFormIterator>
          </ArrayInput>
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};

export default ProductEdit;
