import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ArrayInput,
  SimpleFormIterator,
  required,
  BooleanInput,
  ArrayField,
  SingleFieldList,
  ChipField,
} from "react-admin";

const transform = (data: any) => {
  return {
    ...data,
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
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="factoryName" />
      <TextInput source="description" />
      <NumberInput source="salePrice" />
      <NumberInput source="suggestedDiscountPrice" />
      <NumberInput source="suggestedPrice" />
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
      <ArrayField source="categories">
        <SingleFieldList linkType={false}>
          <ChipField source="category.name" />
        </SingleFieldList>
      </ArrayField>
      <ReferenceArrayInput
        label="Categories"
        source="categories"
        reference="categories"
        format={(value) =>
          value ? value.map((category: any) => category.id) : []
        }
        parse={(value) => (value ? value.map((id: any) => ({ id })) : [])}
      >
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
      <ArrayInput source="images">
        <SimpleFormIterator>
          <TextInput source="url" label="Image URL" validate={[required()]} />
          <TextInput source="color.name" label="Color Name" />
          <TextInput source="color.hex" label="Color Hex" />
          <TextInput source="color.ncm" label="NCM" />
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
    </SimpleForm>
  </Edit>
);

export default ProductEdit;
