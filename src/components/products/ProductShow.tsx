import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  ArrayField,
  SingleFieldList,
  ReferenceField,
  ChipField,
} from "react-admin";
import { ImageDetails } from "./ImageDetails";

const ProductShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="factoryName" />
      <TextField source="description" />
      <TextField source="ncm" />
      <NumberField
        source="price"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <NumberField
        source="cost"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <TextField source="gender" />
      <ArrayField source="taxComissions">
        <SingleFieldList linkType={false}>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
      <ArrayField source="categories">
        <SingleFieldList>
          <ReferenceField source="categoryId" reference="categories">
            <ChipField source="name" />
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
