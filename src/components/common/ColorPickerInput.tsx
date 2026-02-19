import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useInput, InputProps } from "react-admin";

interface ColorPickerInputProps extends Omit<InputProps, "source"> {
  source: string;
  label?: string;
  helperText?: string;
}

const normalizeHex = (value?: string) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
};

const ColorPickerInput: React.FC<ColorPickerInputProps> = ({
  source,
  label,
  helperText,
  ...props
}) => {
  const {
    field: { value, onChange },
  } = useInput({ source, ...props });

  const normalized = normalizeHex(value as string | undefined);
  const previewColor = normalized || "transparent";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
      <Box sx={{ minWidth: 200 }}>
        {label && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            {label}
          </Typography>
        )}
        <input
          type="color"
          value={normalized || "#000000"}
          onChange={(event) => onChange(event.target.value)}
          style={{ width: 64, height: 40, border: "none", background: "none" }}
        />
      </Box>
      <TextField
        label="Hex"
        value={normalized}
        onChange={(event) => onChange(event.target.value)}
        placeholder="#000000"
        size="small"
      />
      <Box
        sx={{
          width: 36,
          height: 36,
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: previewColor,
        }}
      />
      {helperText && (
        <Typography variant="caption" color="text.secondary">
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default ColorPickerInput;
