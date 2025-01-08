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
} from "react-admin";

const transform = (data: any) => {
  return {
    ...data,
    categories: data.categories
      .filter((category: any) => category) // Remove undefined ou falsy values
      .map((category: any) => {
        if (typeof category === "string") {
          return { id: category }; // Para IDs diretos selecionados
        } else if (category.categoryId) {
          return { id: category.categoryId }; // Para objetos completos
        }
        return null; // Filtra valores inválidos
      })
      .filter(Boolean), // Remove valores nulos
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
      />
      <ReferenceArrayInput
        label="Categories"
        source="categories"
        reference="categories"
        format={(value) =>
          value
            ? value.map((category: any) => category.categoryId || category.id)
            : []
        }
        parse={(value) => value.map((id: any) => ({ categoryId: id }))}
      >
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
      <ArrayInput source="images">
        <SimpleFormIterator>
          <TextInput source="hex" />
          <TextInput source="url" />
          <TextInput source="color" />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="colors">
        <SimpleFormIterator>
          <TextInput source="name" />
          <TextInput source="hex" />
          <TextInput source="ncm" />
          <ArrayInput source="sizes">
            <SimpleFormIterator>
              <TextInput source="name" />
              <TextInput source="sku" />
            </SimpleFormIterator>
          </ArrayInput>
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export default ProductEdit;
