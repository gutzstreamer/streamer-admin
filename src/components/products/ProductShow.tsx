import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  ArrayField,
  SingleFieldList,
  ReferenceField,
} from "react-admin";
import { ImageDetails } from "./ImageDetails";

const ProductShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="factoryName" />
      <TextField source="description" />
      <NumberField source="salePrice" />
      <NumberField source="suggestedDiscountPrice" />
      <NumberField source="suggestedPrice" />
      <TextField source="gender" />
      <ArrayField source="categories">
        <SingleFieldList>
          <ReferenceField source="categoryId" reference="categories">
            <TextField source="name" />
          </ReferenceField>
        </SingleFieldList>
      </ArrayField>
      <ArrayField source="images">
        <SingleFieldList linkType={false}>
          <ImageDetails />
        </SingleFieldList>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export default ProductShow;