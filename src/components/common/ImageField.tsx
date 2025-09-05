import React from 'react';
import { useRecordContext } from 'react-admin';
import { Box, Typography } from '@mui/material';

interface ImageFieldProps {
  source: string;
  label?: string;
  width?: number;
  height?: number;
}

const ImageField: React.FC<ImageFieldProps> = ({ 
  source, 
  label,
  width = 200,
  height = 200 
}) => {
  const record = useRecordContext();
  const imageUrl = record?.[source];

  if (!imageUrl) {
    return (
      <Box sx={{ mb: 2 }}>
        {label && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            {label}
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary">
          No image available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      <Box
        component="img"
        src={imageUrl}
        alt={label || 'Image'}
        sx={{
          width: width,
          height: height,
          objectFit: 'cover',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'block'
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.nextElementSibling?.setAttribute('style', 'display: block');
        }}
      />
      <Typography 
        variant="body2" 
        color="error" 
        sx={{ display: 'none', mt: 1 }}
      >
        Failed to load image
      </Typography>
    </Box>
  );
};

export default ImageField;
