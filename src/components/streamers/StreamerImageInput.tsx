import React from 'react';
import { useInput, InputProps } from 'react-admin';
import ImageUpload from '../common/ImageUpload';

interface StreamerImageInputProps extends Omit<InputProps, 'source'> {
  source: string;
  label?: string;
}

const StreamerImageInput: React.FC<StreamerImageInputProps> = ({ 
  source, 
  label = "Streamer Image",
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

export default StreamerImageInput;
