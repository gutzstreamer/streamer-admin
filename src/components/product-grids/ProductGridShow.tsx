import React from "react";
import { Show, SimpleShowLayout, TextField } from "react-admin";

const ProductGridShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="url" />
    </SimpleShowLayout>
  </Show>
);
export default ProductGridShow;
