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

  return (
    <TopToolbar>
      <Button
        variant="contained"
        color="primary"
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
