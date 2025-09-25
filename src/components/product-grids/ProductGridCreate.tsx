import React from "react";
import { Create, SimpleForm, TextInput, useRedirect } from "react-admin";
import ProductImageInput from "../products/ProductImageInput";

const ProductGridCreate: React.FC = (props) => {
  const redirect = useRedirect();
  const onSuccess = () => {
    redirect("list", "product-grid");
  };
  return (
    <Create {...props} mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <TextInput source="name" required />
        <ProductImageInput
          source="base64EncodedImage"
          label="Product Grid Image"
        />
      </SimpleForm>
    </Create>
  );
};

export default ProductGridCreate;
