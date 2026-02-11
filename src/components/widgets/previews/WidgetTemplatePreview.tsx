import React from "react";
import { Box, Typography } from "@mui/material";
import DonationPreview from "./DonationPreview";
import GoalPreview from "./GoalPreview";
import MusicthonPreview from "./MusicthonPreview";
import QrcodePreview from "./QrcodePreview";
import RhynothonPreview from "./RhynothonPreview.tsx";
import StorePreview from "./StorePreview";

export interface WidgetTemplatePreviewData {
  type?: string;
  name?: string;
  imageUrl?: string;
  backgroundColor?: string;
  titleColor?: string;
  messageColor?: string;
  borderColor?: string;
  progressColor?: string;
  barColor?: string;
  textColor?: string;
  valueColor?: string;
}

interface WidgetTemplatePreviewProps {
  data: WidgetTemplatePreviewData;
}

const WidgetTemplatePreview: React.FC<WidgetTemplatePreviewProps> = ({ data }) => {
  if (!data.type) {
    return (
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Selecione um tipo para visualizar o preview.
        </Typography>
      </Box>
    );
  }

  switch (data.type) {
    case "donation":
      return (
        <DonationPreview
          backgroundColor={data.backgroundColor}
          titleColor={data.titleColor}
          messageColor={data.messageColor}
          borderColor={data.borderColor}
          imageUrl={data.imageUrl}
        />
      );
    case "store":
      return (
        <StorePreview
          backgroundColor={data.backgroundColor}
          titleColor={data.titleColor}
          borderColor={data.borderColor}
          imageUrl={data.imageUrl}
        />
      );
    case "goal":
      return (
        <GoalPreview
          backgroundColor={data.backgroundColor}
          progressColor={data.progressColor}
          barColor={data.barColor}
          textColor={data.textColor}
          valueColor={data.valueColor}
          title={data.name}
        />
      );
    case "musicthon":
      return (
        <MusicthonPreview
          backgroundColor={data.backgroundColor}
          textColor={data.textColor}
        />
      );
    case "qrcode":
      return (
        <QrcodePreview
          backgroundColor={data.backgroundColor}
          textColor={data.textColor}
        />
      );
    case "rhynothon":
      return (
        <RhynothonPreview
          backgroundColor={data.backgroundColor}
          textColor={data.textColor}
        />
      );
    default:
      return null;
  }
};

export default WidgetTemplatePreview;
