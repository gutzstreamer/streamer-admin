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
  const value = record?.[source];

  if (!value) return null;

  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Box
        component="img"
        src={`data:image/png;base64,${value}`}
        alt="QR Code"
        sx={{
          width: 80,
          height: 80,
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            width: 200,
            height: 200,
            zIndex: 1000,
            position: 'relative',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          }
        }}
      />
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