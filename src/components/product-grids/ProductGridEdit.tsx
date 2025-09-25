import React from "react";
import { Edit, SimpleForm, TextInput, useRedirect } from "react-admin";
import ProductImageInput from "../products/ProductImageInput";

const ProductGridEdit: React.FC = (props) => {
  const redirect = useRedirect();
  const onSuccess = () => {
    redirect("list", "product-grid");
  };
  return (
    <Edit {...props} mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <TextInput source="name" required />
        <ProductImageInput
          source="base64EncodedImage"
          label="Product Grid Image"
        />
      </SimpleForm>
    </Edit>
  );
};

export default ProductGridEdit;
