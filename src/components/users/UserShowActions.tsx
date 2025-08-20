import {
  TopToolbar,
  useNotify,
  useRefresh,
  useRecordContext,
} from "react-admin";
import { Button, CircularProgress } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useState } from "react";
import streamerDataProvider from "../../dataProvider";

const UserShowActions = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!record) {
      notify("Registro não encontrado.", { type: "warning" });
      return;
    }
    setLoading(true);
    try {
      await streamerDataProvider.resetPassword("users", { id: record.id });
      notify("Senha resetada com sucesso", { type: "success" });
      refresh();
    } catch (error: any) {
      notify(`Erro ao resetar senha: ${error.message}`, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TopToolbar>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        startIcon={
          loading ? <CircularProgress size={16} color="inherit" /> : <LockResetIcon />
        }
        onClick={handleResetPassword}
        disabled={loading}
      >
        {loading ? "Processando..." : "Resetar Senha"}
      </Button>
    </TopToolbar>
  );
};

export default UserShowActions;
