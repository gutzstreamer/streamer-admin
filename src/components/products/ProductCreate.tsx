import React from "react";
import {
  Create,
  TextInput,
  NumberInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  ArrayInput,
  SimpleFormIterator,
  useRedirect,
  TabbedForm,
  FormTab,
  required,
  ReferenceInput,
} from "react-admin";

const SIZE_OPTIONS = [
  { id: "P", name: "P" },
  { id: "M", name: "M" },
  { id: "G", name: "G" },
  { id: "GG", name: "GG" },
  { id: "XGG", name: "XGG" },
  { id: "G1", name: "G1" },
  { id: "G2", name: "G2" },
  { id: "G3", name: "G3" },
  { id: "G4", name: "G4" },
  { id: "U", name: "U" },
  { id: "2Anos", name: "2 anos" },
  { id: "4Anos", name: "4 anos" },
  { id: "6Anos", name: "6 anos" },
  { id: "8Anos", name: "8 anos" },
  { id: "10Anos", name: "10 anos" },
  { id: "12Anos", name: "12 anos" },
  { id: "14Anos", name: "14 anos" },
];

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

const ProductCreate: React.FC = (props) => {
  const redirect = useRedirect();

  const onSuccess = () => {
    redirect("list", "products");
  };
  return (
    <Create {...props} transform={transform} mutationOptions={{ onSuccess }}>
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
          />
          <ReferenceArrayInput
            label="Categories"
            source="categories"
            reference="categories"
          >
            <SelectArrayInput optionText="name" />
          </ReferenceArrayInput>
        </FormTab>
        <FormTab label="Details">
          <ArrayInput source="images">
            <SimpleFormIterator>
              <TextInput
                source="url"
                label="Image URL"
                validate={[required()]}
              />
              <TextInput source="color.name" label="Color Name" />
              <TextInput source="color.hex" label="Color Hex" />
              <ArrayInput source="color.sizes" label="Tamanhos">
                <SimpleFormIterator>
                  <SelectInput
                    source="name"
                    label="Tamanho"
                    choices={SIZE_OPTIONS}
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
    </Create>
  );
};

export default ProductCreate;
