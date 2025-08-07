import React, { useState } from 'react';
import { Button, Box, Typography, IconButton } from '@mui/material';
import { Delete, CloudUpload } from '@mui/icons-material';

interface ImageUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  onRemove?: () => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  accept = "image/*",
  maxSizeMB = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const inputId = `image-upload-${Math.random().toString(36).substr(2, 9)}`;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validar tamanho do arquivo
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setError("");
    setUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onChange(base64);
      setUploading(false);
    };

    reader.onerror = () => {
      setError('Error reading file');
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange("");
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      
      {value && !value.startsWith('data:image/') ? (
        // Exibir imagem existente (URL do R2)
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
          <img
            src={value}
            alt="Product"
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              objectFit: 'cover',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <IconButton
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: 'red',
              color: 'white',
              '&:hover': { backgroundColor: 'darkred' }
            }}
            size="small"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ) : value && value.startsWith('data:image/') ? (
        // Exibir preview da imagem base64
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
          <img
            src={value}
            alt="Preview"
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              objectFit: 'cover',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <IconButton
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: 'red',
              color: 'white',
              '&:hover': { backgroundColor: 'darkred' }
            }}
            size="small"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ) : null}

      <Box>
        <input
          accept={accept}
          style={{ display: 'none' }}
          id={inputId}
          type="file"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        <label htmlFor={inputId}>
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUpload />}
            disabled={uploading}
            sx={{ mr: 1 }}
          >
            {uploading ? 'Uploading...' : value ? 'Change Image' : 'Select Image'}
          </Button>
        </label>
        
        {value && (
          <Button
            variant="text"
            color="error"
            onClick={handleRemove}
            startIcon={<Delete />}
          >
            Remove
          </Button>
        )}
      </Box>

      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;
