import React from "react";
import { Box, Typography } from "@mui/material";

interface DonationPreviewProps {
  backgroundColor?: string;
  titleColor?: string;
  messageColor?: string;
  borderColor?: string;
  imageUrl?: string;
}

const DonationPreview: React.FC<DonationPreviewProps> = ({
  backgroundColor = "#572aae",
  titleColor = "#ffffff",
  messageColor = "#ffffff",
  borderColor,
  imageUrl,
}) => {
  return (
    <Box sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}>
      <Box sx={{ position: "relative", width: 500, height: 130 }}>
        <Box
          sx={{
            position: "absolute",
            left: -46,
            top: "50%",
            transform: "translateY(-50%)",
            width: 130,
            height: 130,
            borderRadius: "50%",
            backgroundColor,
            border: borderColor ? `2px solid ${borderColor}` : undefined,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imageUrl ? (
            <Box component="img" src={imageUrl} alt="Avatar" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Typography variant="subtitle2" color="#fff">
              IMG
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            height: 130,
            borderRadius: "18px",
            backgroundColor,
            border: borderColor ? `2px solid ${borderColor}` : undefined,
            pl: "85px",
            pr: "12px",
            py: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              sx={{
                color: titleColor,
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1.1,
                textShadow: "-1px -1px 0 rgba(0,0,0,0.35), 1px -1px 0 rgba(0,0,0,0.35), -1px 1px 0 rgba(0,0,0,0.35), 1px 1px 0 rgba(0,0,0,0.35)",
              }}
            >
              Gutz doou R$ 50,00
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                color: messageColor,
                fontSize: 20,
                lineHeight: 1.25,
                opacity: 0.9,
                textShadow: "-1px -1px 0 rgba(0,0,0,0.3), 1px -1px 0 rgba(0,0,0,0.3), -1px 1px 0 rgba(0,0,0,0.3), 1px 1px 0 rgba(0,0,0,0.3)",
              }}
            >
              Salve meu querido, gosto muito das suas lives.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DonationPreview;
