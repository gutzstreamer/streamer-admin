import React, { useState } from "react";
import {
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
      const response = await streamerDataProvider.cancelDonation(
        String(record.id),
      );

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
          <Alert severity="warning">
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

const DonateShowActions: React.FC = () => (
  <TopToolbar>
    <CancelDonationButton />
  </TopToolbar>
);

export default DonateShowActions;