import {
  Show,
  SimpleShowLayout,
  TextField,
  ArrayField,
  Datagrid,
  ReferenceField,
} from 'react-admin';

const FactoryProductShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />

      <ArrayField source="mappingsDimona" label="Dimona Mappings">
        <Datagrid>
          <TextField source="dimonaSku" label="Dimona SKU" />
          <TextField source="productVariant.sku" label="Variant SKU" />
          <TextField source="productVariant.price" label="Variant Price" />
          <TextField source="productVariant.cost" label="Variant Cost" />
          <TextField source="productVariant.active" label="Variant Active" />

          <ReferenceField
            label="Linked Product"
            source="productVariant.productId"
            reference="products"
            link="show"
          >
            <TextField source="name" />
          </ReferenceField>
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export default FactoryProductShow;
