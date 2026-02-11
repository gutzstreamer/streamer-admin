import React from "react";
import { Box, Typography } from "@mui/material";

interface RhynothonPreviewProps {
  backgroundColor?: string;
  textColor?: string;
}

const RhynothonPreview: React.FC<RhynothonPreviewProps> = ({
  backgroundColor = "#000000",
  textColor = "#ffffff",
}) => {
  return (
    <Box sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          fontWeight: 700,
          letterSpacing: "6px",
          padding: "24px 28px",
          borderRadius: "12px",
          textShadow: "2px 2px 4px rgba(0,0,0,0.45)",
          fontSize: 28,
          backgroundColor,
          color: textColor,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Typography sx={{ fontSize: 28, fontWeight: 700 }}>00</Typography>
        <Typography sx={{ fontSize: 28, fontWeight: 700 }}>:</Typography>
        <Typography sx={{ fontSize: 28, fontWeight: 700 }}>12</Typography>
        <Typography sx={{ fontSize: 28, fontWeight: 700 }}>:</Typography>
        <Typography sx={{ fontSize: 28, fontWeight: 700 }}>45</Typography>
        <Typography sx={{ fontSize: 28, fontWeight: 700 }}>:</Typography>
        <Typography sx={{ fontSize: 28, fontWeight: 700 }}>08</Typography>
      </Box>
    </Box>
  );
};

export default RhynothonPreview;
