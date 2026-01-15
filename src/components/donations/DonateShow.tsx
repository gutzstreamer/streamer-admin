import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  BooleanField,
  useRecordContext,
} from "react-admin";
import { Box, Typography } from "@mui/material";
import DonateShowActions from "./DonateShowActions";

const QRCodeField: React.FC<{ source: string; label?: string }> = ({ 
  source, 
  label = "QR Code" 
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
          No QR Code available
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
        alt="QR Code"
        sx={{
          width: 80,
          height: 80,
          objectFit: 'cover',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'block',
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            width: 200,
            height: 200,
            zIndex: 1000,
            position: 'relative',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          }
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
        Failed to load QR Code
      </Typography>
    </Box>
  );
};

const DonateShow: React.FC = (props) => (
  <Show {...props} actions={<DonateShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="streamerId" reference="streamers">
        <TextField source="name" />
      </ReferenceField>
      <NumberField
        source="amount"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <NumberField source="fee" locales="pt-BR" />
      <NumberField
        source="netAmount"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <TextField source="message" />
      <TextField source="username" />
      <BooleanField source="paid" label="Paga" />
      <ReferenceField
        source="transactionId"
        reference="wallet-transactions"
        label="Status da Transação"
      >
        <TextField source="status" />
      </ReferenceField>
      <TextField source="paymentCode" />
      <QRCodeField source="qrCode" label="QR Code" />
      <TextField source="transactionId" />
      <DateField source="createdAt" label="Created At" showTime />
    </SimpleShowLayout>
  </Show>
);

export default DonateShow;