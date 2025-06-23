import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  DateField,
  ArrayField,
  Datagrid,
  NumberField,
  ReferenceField,
} from 'react-admin';

// SHOW VIEW
export const ProductShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <BooleanField source="active" />
      <TextField source="ncm" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />

      <ArrayField source="categories" label="Categories">
        <Datagrid bulkActionButtons={false}>
          <ReferenceField source="categoryId" reference="categories">
            <TextField source="name" />
          </ReferenceField>
        </Datagrid>
      </ArrayField>

      <ArrayField source="variants" label="Variants">
        <Datagrid bulkActionButtons={false}>
          <TextField source="sku" />
          <NumberField source="price" />
          <NumberField source="cost" />
          <BooleanField source="active" />
          <ReferenceField source="colorId" reference="colors">
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField source="sizeId" reference="sizes">
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField source="genderId" reference="genders">
            <TextField source="name" />
          </ReferenceField>
          <TextField source="dimonaMapping.dimonaSku" label="Dimona SKU" />
        </Datagrid>
      </ArrayField>

      <ArrayField source="images" label="Images">
        <Datagrid bulkActionButtons={false}>
          <TextField source="url" />
          <ReferenceField source="colorId" reference="colors">
            <TextField source="name" />
          </ReferenceField>
        </Datagrid>
      </ArrayField>

      <ArrayField source="taxComissions" label="Tax Commissions">
        <Datagrid bulkActionButtons={false}>
          <TextField source="name" />
          <NumberField source="value" />
          <ReferenceField source="subscriptionPlanId" reference="subscription-plan">
            <TextField source="name" />
          </ReferenceField>
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);