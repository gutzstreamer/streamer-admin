import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  ArrayField,
  SingleFieldList,
  ChipField,
} from "react-admin";

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
          <ChipField source="id" />
        </SingleFieldList>
      </ArrayField>
      <ArrayField source="images">
        <SingleFieldList>
          <ChipField source="url" />
        </SingleFieldList>
      </ArrayField>
      <ArrayField source="colors">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export default ProductShow;
