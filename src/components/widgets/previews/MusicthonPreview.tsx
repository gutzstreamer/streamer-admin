import React from "react";
import { Box, Typography } from "@mui/material";

interface MusicthonPreviewProps {
  backgroundColor?: string;
  textColor?: string;
}

const hexToRgb = (value: string) => {
  const normalized = value.replace("#", "").trim();
  if (![3, 6].includes(normalized.length)) return null;
  const hex = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;
  const intValue = Number.parseInt(hex, 16);
  if (Number.isNaN(intValue)) return null;
  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255,
  };
};

const MusicthonPreview: React.FC<MusicthonPreviewProps> = ({
  backgroundColor = "#9c27b0",
  textColor = "#ffffff",
}) => {
  const rgb = hexToRgb(backgroundColor) || { r: 156, g: 39, b: 176 };
  const rgbValue = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

  return (
    <Box sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}>
      <Box
        sx={{
          width: 240,
          borderRadius: "14px",
          p: "10px 12px 12px 10px",
          color: textColor,
          background: `radial-gradient(circle at top left, rgba(${rgbValue}, 0.38), rgba(10,12,18,0.05) 55%), linear-gradient(145deg, rgba(16,14,28,0.78), rgba(10,12,18,0.92))`,
          border: `1px solid rgba(${rgbValue}, 0.4)`,
          boxShadow: "0 18px 36px rgba(0,0,0,0.35)",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 600, fontSize: 14 }}>
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: 2,
                backgroundColor: `rgba(${rgbValue}, 0.22)`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
              }}
            />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Baile do Rhyno</Typography>
          </Box>
          <Typography sx={{ fontSize: 12, opacity: 0.8 }}>play</Typography>
        </Box>
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>NOME DOADOR</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>R$ 10</Typography>
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Nome da Musica - Artista</Typography>
          <Box sx={{ mt: 0.5, display: "flex", gap: "3px" }}>
            {Array.from({ length: 12 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 4,
                  height: 10,
                  borderRadius: "999px",
                  background: `linear-gradient(180deg, ${textColor}, rgba(255,255,255,0.45))`,
                  opacity: 0.8,
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MusicthonPreview;
