import React, { useEffect, useState } from "react";
import {
  Edit,
  TextInput,
  NumberInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  required,
  BooleanInput,
  ArrayField,
  SingleFieldList,
  ChipField,
  TabbedForm,
  FormTab,
  ReferenceInput,
  ReferenceField,
  ReferenceArrayInput,
  SelectArrayInput,
} from "react-admin";
import ProductImageInput from "./ProductImageInput";

const transform = (data: any) => {
  return {
    ...data,
    taxComissions: data.taxComissions.map((taxComission: any) => ({
      id: taxComission.id || undefined,
      name: taxComission.name,
      value: taxComission.value,
      subscriptionPlanId: taxComission.subscriptionPlanId
        ? taxComission.subscriptionPlanId
        : undefined,
    })),
    categories: data.categories.map(
      (category: any) =>
        typeof category === "object" && category.categoryId
          ? { id: category.categoryId } // Se for um objeto com categoryId
          : { id: category }, // Se for apenas um ID (string)
    ),
    images: data.images.map((image: any) => ({
      id: image.id || undefined, // Garante que IDs existentes são enviados, ou undefined para novos registros
      url: image.url,
      color: image.color
        ? {
            id: image.color.id || undefined,
            name: image.color.name,
            hex: image.color.hex,
            ncm: image.color.ncm,
            sizes: image.color.sizes.map((size: any) => ({
              id: size.id || undefined,
              name: size.name,
              sku: size.sku,
            })),
          }
        : undefined, // Ignora cores inexistentes
    })),
  };
};

const ProductEdit: React.FC = (props) => (
  <Edit {...props} transform={transform}>
    <TabbedForm>
      <FormTab label="General">
        <TextInput source="name" />
        <TextInput source="factoryName" />
        <TextInput multiline source="description" />
        <TextInput source="ncm" />
        <NumberInput source="cost" />
        <NumberInput source="price" />
        <SelectInput
          source="gender"
          choices={[
            { id: "MALE", name: "Male" },
            { id: "FEMALE", name: "Female" },
            { id: "UNISEX", name: "Unisex" },
          ]}
          validate={required()}
        />
        <BooleanInput source="active" />
        <ArrayInput source="categories">
          <SimpleFormIterator>
            <ReferenceInput source="categoryId" reference="categories">
              <SelectInput optionText="name" />
            </ReferenceInput>
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
      <FormTab label="Details">
        <ArrayInput source="images">
          <SimpleFormIterator>
            <ProductImageInput source="url" label="Product Image" />
            <TextInput source="color.name" label="Color Name" />
            <TextInput source="color.hex" label="Color Hex" />
            <ArrayInput source="color.sizes">
              <SimpleFormIterator>
                <TextInput
                  source="name"
                  label="Size Name"
                  validate={required()}
                />
                <TextInput source="sku" label="SKU" validate={required()} />
              </SimpleFormIterator>
            </ArrayInput>
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
      <FormTab label="Tax">
        <ArrayInput source="taxComissions">
          <SimpleFormIterator>
            <TextInput source="name" label="Name" validate={required()} />
            <NumberInput source="value" label="Value" validate={required()} />
            <ReferenceInput
              label="Subscription Plan"
              source="subscriptionPlanId"
              reference="subscription-plan"
              format={(value) => value && value.id}
              parse={(value) => ({ subscriptionPlanId: value })}
            >
              <SelectInput optionText="name" />
            </ReferenceInput>
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default ProductEdit;
