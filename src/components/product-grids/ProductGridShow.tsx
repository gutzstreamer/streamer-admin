import React from "react";
import { Show, SimpleShowLayout, TextField, ImageField } from "react-admin";

const ProductGridShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <ImageField source="url" label="Image" />
    </SimpleShowLayout>
  </Show>
);

export default ProductGridShow;
