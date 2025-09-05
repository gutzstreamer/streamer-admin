import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  ArrayField,
  ImageField,
  SingleFieldList,
} from "react-admin";

const ProductStreamerShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <NumberField
        source="price"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <NumberField
        source="discountPrice"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <TextField source="status" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />

      <ReferenceField source="productId" reference="products">
        <TextField source="name" />
      </ReferenceField>

      <ReferenceField source="streamerId" reference="streamers">
        <TextField source="name" />
      </ReferenceField>

      <ArrayField source="mockups">
        <SingleFieldList linkType={false}>
          <ImageField source="url" title="color" />
        </SingleFieldList>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export default ProductStreamerShow;
