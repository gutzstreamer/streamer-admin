import React from "react";
import { Box, Typography } from "@mui/material";

interface GoalPreviewProps {
  backgroundColor?: string;
  progressColor?: string;
  barColor?: string;
  textColor?: string;
  valueColor?: string;
  title?: string;
}

const GoalPreview: React.FC<GoalPreviewProps> = ({
  backgroundColor = "#00000000",
  progressColor = "#9c27b0",
  barColor = "#ffffff",
  textColor = "#000000",
  valueColor = "#000000",
  title = "Meta de Exemplo",
}) => {
  const current = 650;
  const final = 1000;
  const percent = Math.round((current / final) * 100);
  const progressText = `R$ ${current} / R$ ${final}`;

  return (
    <Box sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}>
      <Box
        sx={{
          width: 450,
          borderRadius: "8px",
          padding: "12px 0",
          background: backgroundColor,
        }}
      >
        <Box sx={{ mx: 2 }}>
          <Box
            sx={{
              width: "100%",
              height: 24,
              borderRadius: 12,
              backgroundColor: barColor,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${percent}%`,
                height: "100%",
                borderRadius: 12,
                backgroundColor: progressColor,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.5,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <Typography
                sx={{
                  color: textColor,
                  fontSize: 12,
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {title}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography sx={{ color: valueColor, fontSize: 12, fontWeight: 700 }}>
                  {progressText}
                </Typography>
                <Typography sx={{ color: valueColor, fontSize: 12, fontWeight: 700 }}>
                  {percent}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GoalPreview;
