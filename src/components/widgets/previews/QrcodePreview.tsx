import React from "react";
import { Box, Typography } from "@mui/material";

interface QrcodePreviewProps {
  backgroundColor?: string;
  textColor?: string;
}

const QrcodePreview: React.FC<QrcodePreviewProps> = ({
  backgroundColor = "#7b1fa2",
  textColor = "#ffffff",
}) => {
  return (
    <Box sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}>
      <Box sx={{ backgroundColor, color: textColor, borderRadius: 2, p: 1, maxWidth: 250 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: "center", mb: 1 }}>
          rhyno.gg/username
        </Typography>
        <Box
          sx={{
            width: 220,
            height: 220,
            borderRadius: 2,
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
          }}
        >
          <Box
            sx={{
              width: 140,
              height: 140,
              border: "8px solid #000",
              borderRadius: 2,
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                width: 24,
                height: 24,
                backgroundColor: "#000",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                width: 24,
                height: 24,
                backgroundColor: "#000",
              }}
            />
          </Box>
        </Box>
        <Typography sx={{ mt: 1, fontSize: 16, fontWeight: 700, textAlign: "center" }}>
          Conheca a Rhyno!
        </Typography>
      </Box>
    </Box>
  );
};

export default QrcodePreview;
