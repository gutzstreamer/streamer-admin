import React from 'react';
import { useInput, InputProps } from 'react-admin';
import ImageUpload from '../common/ImageUpload';

interface ProductImageInputProps extends Omit<InputProps, 'source'> {
  source: string;
  label?: string;
}

const ProductImageInput: React.FC<ProductImageInputProps> = ({ 
  source, 
  label = "Product Image",
  ...props 
}) => {
  const {
    field: { value, onChange }
  } = useInput({ source, ...props });

  return (
    <ImageUpload
      value={value || ""}
      onChange={onChange}
      label={label}
      accept="image/*"
      maxSizeMB={5}
    />
  );
};

export default ProductImageInput;
