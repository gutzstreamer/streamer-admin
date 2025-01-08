import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ArrayInput,
  SimpleFormIterator,
  useRedirect,
} from "react-admin";

const transform = (data: any) => {
  return {
    ...data,
    categories: data.categories.map((id: any) => ({ id })),
  };
};

const ProductCreate: React.FC = (props) => {
  const redirect = useRedirect();

  const onSuccess = () => {
    redirect("list", "products");
  };
  return (
    <Create {...props} transform={transform} mutationOptions={{ onSuccess }}>
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
    </Create>
  );
};

export default ProductCreate;
