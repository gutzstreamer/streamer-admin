import {
  TopToolbar,
  useNotify,
  useRefresh,
  useRecordContext,
} from "react-admin";
import { Button, CircularProgress } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import { useState } from "react";
import streamerDataProvider from "../../dataProvider";

const OrderShowActions = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();

  const [loading, setLoading] = useState<"invoice" | "factory" | null>(null);
  const [loadingChecks, setLoadingChecks] = useState<
    "invoice" | "factory" | null
  >(null);

  const handleRetry = async (type: "invoice" | "factory") => {
    if (!record) {
      notify("Registro não encontrado.", { type: "warning" });
      return;
    }
    setLoading(type);
    try {
      await streamerDataProvider.retry("orders", { id: record.id }, type);
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
      await streamerDataProvider.checks("orders", { id: record.id }, type);
      notify(`Checks ${type} executado com sucesso`, { type: "success" });
      refresh();
    } catch (error: any) {
      notify(`Erro ao executar Checks ${type}: ${error.message}`, {
        type: "error",
      });
    } finally {
      setLoadingChecks(null);
    }
  };

  return (
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
        variant="contained"
        color="primary"
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
  );
};

export default OrderShowActions;
