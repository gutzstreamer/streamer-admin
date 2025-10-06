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

  const [loading, setLoading] = useState<"invoice" | "factory" | null>(null);
  const [loadingChecks, setLoadingChecks] = useState<
    "invoice" | "factory" | null
  >(null);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const getStatusColor = (status: string, success: boolean) => {
    if (!success) return "error";

    switch (status) {
      case "invoice_exists":
      case "already_in_factory":
      case "sent_successfully":
        return "success";
      case "invoice_generation_started":
      case "found_and_synced":
        return "info";
      case "invalid_status":
      case "generation_failed":
        return "warning";
      default:
        return "default";
    }
  };

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

  const handleRetry = async (type: "invoice" | "factory") => {
    if (!record) {
      notify("Registro não encontrado.", { type: "warning" });
      return;
    }
    setLoading(type);
    try {
      await streamerDataProvider.retry(
        "orders",
        { id: record.id.toString() },
        type,
      );
      notify(`Retry ${type} executado com sucesso`, { type: "success" });
      refresh();
    } catch (error: any) {
      notify(`Erro ao executar Retry ${type}: ${error.message}`, {
        type: "error",
      });
    } finally {
      setLoading(null);
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

        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={
            loading === "invoice" ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <ReplayIcon />
            )
          }
          onClick={() => handleRetry("invoice")}
          disabled={loading !== null}
        >
          {loading === "invoice" ? "Processando..." : "Retry Invoice"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={
            loading === "factory" ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <ReplayIcon />
            )
          }
          onClick={() => handleRetry("factory")}
          disabled={loading !== null}
        >
          {loading === "factory" ? "Processando..." : "Retry Factory"}
        </Button>
      </TopToolbar>

      {/* Modal para mostrar os resultados do check */}
      <Dialog
        open={showResultDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
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
                sx={{ mb: 2 }}
              >
                <Typography variant="h6" gutterBottom>
                  {checkResult.title}
                </Typography>
                <Typography variant="body1">{checkResult.message}</Typography>
              </Alert>

              <Box display="flex" gap={1} mb={2}>
                <Chip
                  label={`Status: ${checkResult.status}`}
                  color={
                    getStatusColor(
                      checkResult.status,
                      checkResult.success,
                    ) as any
                  }
                  variant="outlined"
                />
                <Chip
                  label={checkResult.success ? "Sucesso" : "Erro"}
                  color={checkResult.success ? "success" : "error"}
                />
              </Box>

              {checkResult.invoice && (
                <Box mt={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    📄 Informações da Nota Fiscal:
                  </Typography>
                  <Box bgcolor="grey.100" p={2} borderRadius={1}>
                    <Typography variant="body2">
                      ID: {checkResult.invoice.id}
                    </Typography>
                    {checkResult.invoice.status && (
                      <Typography variant="body2">
                        Status: {checkResult.invoice.status}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}

              {checkResult.factoryOrder && (
                <Box mt={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    🏭 Informações da Fábrica:
                  </Typography>
                  <Box bgcolor="grey.100" p={2} borderRadius={1}>
                    <Typography variant="body2">
                      Order ID: {checkResult.factoryOrder.id}
                    </Typography>
                  </Box>
                </Box>
              )}

              {checkResult.order && (
                <Box mt={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    📦 Informações do Pedido:
                  </Typography>
                  <Box bgcolor="grey.100" p={2} borderRadius={1}>
                    <Typography variant="body2">
                      ID: {checkResult.order.id}
                    </Typography>
                    <Typography variant="body2">
                      Status Atual: {checkResult.order.currentStatus}
                    </Typography>
                    <Typography variant="body2">
                      Valor Total: R${" "}
                      {checkResult.order.totalAmount?.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderShowActions;
