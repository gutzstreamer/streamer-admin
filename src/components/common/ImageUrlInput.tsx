import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useInput, InputProps } from "react-admin";
import ImageUpload from "./ImageUpload";

interface ImageUrlInputProps extends Omit<InputProps, "source"> {
  source: string;
  label?: string;
  helperText?: string;
}

const ImageUrlInput: React.FC<ImageUrlInputProps> = ({
  source,
  label,
  helperText,
  ...props
}) => {
  const {
    field: { value, onChange },
  } = useInput({ source, ...props });

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      {label && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      <TextField
        fullWidth
        placeholder="https://..."
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        helperText={helperText}
        size="small"
        sx={{ mb: 2 }}
      />
      <ImageUpload value={value || ""} onChange={onChange} accept="image/*" maxSizeMB={5} />
    </Box>
  );
};

export default ImageUrlInput;
