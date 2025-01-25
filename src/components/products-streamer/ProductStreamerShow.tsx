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
      <NumberField source="price" />
      <NumberField source="discountPrice" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <ArrayField source="mockups">
        <SingleFieldList linkType={false}>
          <ImageField source="url" title="color" />
        </SingleFieldList>
      </ArrayField>
      <ReferenceField source="productId" reference="products">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="streamerId" reference="streamers">
        <TextField source="name" />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
);

export default ProductStreamerShow;
