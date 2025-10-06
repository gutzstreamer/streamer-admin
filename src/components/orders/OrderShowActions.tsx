import {
  TopToolbar,
  useNotify,
  useRefresh,
  useRecordContext,
} from "react-admin";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Alert,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";
import streamerDataProvider from "../../dataProvider";

interface CheckResult {
  success: boolean;
  status: string;
  title: string;
  message: string;
  order?: any;
  invoice?: any;
  factoryOrder?: any;
}

const OrderShowActions = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();

  const [loadingChecks, setLoadingChecks] = useState<
    "invoice" | "factory" | null
  >(null);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const getStatusIcon = (status: string, success: boolean) => {
    if (!success) return <ErrorIcon />;

    switch (status) {
      case "invoice_exists":
      case "already_in_factory":
      case "sent_successfully":
        return <CheckCircleIcon />;
      case "invoice_generation_started":
      case "found_and_synced":
        return <InfoIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const handleChecks = async (type: "invoice" | "factory") => {
    if (!record) {
      notify("Registro não encontrado.", { type: "warning" });
      return;
    }
    setLoadingChecks(type);
    try {
      const response = await streamerDataProvider.checks(
        "orders",
        { id: record.id.toString() },
        type,
      );

      // Se a resposta tem a estrutura esperada, mostra no modal
      if (
        response.json &&
        (response.json.success !== undefined || response.json.status)
      ) {
        setCheckResult(response.json);
        setShowResultDialog(true);
      } else {
        // Fallback para respostas antigas
        notify(`Checks ${type} executado com sucesso`, { type: "success" });
      }

      refresh();
    } catch (error: any) {
      notify(`Erro ao executar Checks ${type}: ${error.message}`, {
        type: "error",
      });
    } finally {
      setLoadingChecks(null);
    }
  };

  const handleCloseDialog = () => {
    setShowResultDialog(false);
    setCheckResult(null);
  };

  return (
    <>
      <TopToolbar>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={
            loadingChecks === "invoice" ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <ReplayIcon />
            )
          }
          onClick={() => handleChecks("invoice")}
          disabled={loadingChecks !== null}
        >
          {loadingChecks === "invoice" ? "Processando..." : "Check Invoice"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={
            loadingChecks === "factory" ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <ReplayIcon />
            )
          }
          onClick={() => handleChecks("factory")}
          disabled={loadingChecks !== null}
        >
          {loadingChecks === "factory" ? "Processando..." : "Check Factory"}
        </Button>
      </TopToolbar>

      {/* Modal para mostrar os resultados do check */}
      <Dialog
        open={showResultDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            {checkResult &&
              getStatusIcon(checkResult.status, checkResult.success)}
            <Typography variant="h6">Resultado da Verificação</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          {checkResult && (
            <Box>
              <Alert
                severity={checkResult.success ? "success" : "error"}
                sx={{ mb: 3 }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {checkResult.title}
                </Typography>
                <Typography variant="body2">{checkResult.message}</Typography>
              </Alert>

              <Box mb={2}>
                <Chip
                  label={checkResult.success ? "✅ Sucesso" : "❌ Erro"}
                  color={checkResult.success ? "success" : "error"}
                  size="small"
                />
              </Box>

              {/* Informações do Pedido */}
              {checkResult.order && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    � Pedido
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>ID:</strong> {checkResult.order.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Status:</strong> {checkResult.order.currentStatus}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Valor:</strong> R${" "}
                    {checkResult.order.totalAmount?.toFixed(2)}
                  </Typography>
                </Box>
              )}

              {/* Informações da Nota Fiscal */}
              {checkResult.invoice && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    📄 Nota Fiscal
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>ID:</strong> {checkResult.invoice.id}
                  </Typography>
                  {checkResult.invoice.status && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Status:</strong> {checkResult.invoice.status}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Informações da Fábrica */}
              {checkResult.factoryOrder && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    🏭 Fábrica
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Order ID:</strong> {checkResult.factoryOrder.id}
                  </Typography>
                  {checkResult.factoryOrder.status && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Status:</strong> {checkResult.factoryOrder.status}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Status detalhado */}
              <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Status Técnico:</strong> {checkResult.status}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderShowActions;
