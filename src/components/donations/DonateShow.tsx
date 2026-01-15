import React, { useState } from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  BooleanField,
  TopToolbar,
  useNotify,
  useRefresh,
  useRecordContext,
} from "react-admin";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import streamerDataProvider from "../../dataProvider";

const CancelDonationButton: React.FC = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Só exibe o botão se a doação estiver paga
  if (!record?.paid) {
    return null;
  }

  const handleCancelDonation = async () => {
    if (!record?.id) return;

    try {
      setLoading(true);
      const response = await streamerDataProvider.cancelDonation(String(record.id));
      
      notify("Doação cancelada com sucesso!", { type: "success" });
      setShowConfirmDialog(false);
      refresh();
    } catch (error: any) {
      notify(error?.message || "Erro ao cancelar a doação", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const openConfirmDialog = () => {
    setShowConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        size="small"
        startIcon={<CancelIcon />}
        onClick={openConfirmDialog}
        disabled={loading}
      >
        Cancelar Doação
      </Button>

      <Dialog
        open={showConfirmDialog}
        onClose={closeConfirmDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <CancelIcon color="error" />
            <Typography variant="h6">Cancelar Doação</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              ⚠️ Atenção - Doação Paga
            </Typography>
            <Typography variant="body2" gutterBottom>
              Esta doação já foi paga e processada. Ao prosseguir com o cancelamento:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 1 }}>
              <li>
                <Typography variant="body2">
                  O valor será automaticamente retirado da carteira do usuário
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  O estorno financeiro deverá ser processado manualmente
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Esta ação não pode ser desfeita
                </Typography>
              </li>
            </Box>
          </Alert>

          {record && (
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                📋 Detalhes da Doação
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>ID:</strong> {record.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(record.amount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Username:</strong> {record.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Status:</strong> {record.paid ? 'Paga' : 'Pendente'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Mensagem:</strong> {record.message || 'Sem mensagem'}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button 
            onClick={closeConfirmDialog} 
            disabled={loading}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCancelDonation}
            disabled={loading}
            color="error"
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} /> : <CancelIcon />}
          >
            {loading ? 'Cancelando...' : 'Confirmar Cancelamento'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const DonateShowActions = () => (
  <TopToolbar>
    <CancelDonationButton />
  </TopToolbar>
);

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
      <ReferenceField source="transactionId" reference="wallet-transactions" label="Status da Transação">
        <TextField source="status" />
      </ReferenceField>
      <TextField source="paymentCode" />
      <TextField source="qrCode" />
      <TextField source="transactionId" />
      <DateField source="createdAt" label="Created At" showTime />
    </SimpleShowLayout>
  </Show>
);

export default DonateShow;
