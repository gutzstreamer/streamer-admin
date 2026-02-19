import React from "react";
import { Box, Typography } from "@mui/material";

interface StorePreviewProps {
  backgroundColor?: string;
  titleColor?: string;
  imageUrl?: string;
}

const StorePreview: React.FC<StorePreviewProps> = ({
  backgroundColor = "#572aae",
  titleColor = "#ffffff",
  imageUrl,
}) => {
  return (
    <Box
      sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}
    >
      <Box sx={{ position: "relative", width: 500, height: 100 }}>
        <Box
          sx={{
            position: "absolute",
            left: -35,
            top: "50%",
            transform: "translateY(-50%)",
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt="Avatar"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Typography variant="subtitle2" color="#fff">
              IMG
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            height: 100,
            borderRadius: "18px",
            backgroundColor,
            pl: "66px",
            pr: "12px",
            py: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              color: titleColor,
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.1,
              textShadow:
                "-1px -1px 0 rgba(0,0,0,0.35), 1px -1px 0 rgba(0,0,0,0.35), -1px 1px 0 rgba(0,0,0,0.35), 1px 1px 0 rgba(0,0,0,0.35)",
            }}
          >
            Gutz comprou 2 Moletons Rhyno
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default StorePreview;
