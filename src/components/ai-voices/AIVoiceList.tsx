import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  DateInput,
  TopToolbar,
  useNotify,
  useRefresh,
  Button,
  Loading,
  Filter,
  TextInput,
  SelectInput,
} from "react-admin";
import React from "react";
import { Sync as SyncIcon } from "@mui/icons-material";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { DatePresetInput } from "../common/DatePresetInput";

const ElevenLabsStatusWithSync: React.FC = () => {
  const [status, setStatus] = React.useState<any>(null);
  const [usage, setUsage] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const notify = useNotify();
  const refresh = useRefresh();
  const [syncing, setSyncing] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL;

        const [statusRes, usageRes] = await Promise.all([
          fetch(`${apiUrl}/ai-voice/elevenlabs/status`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${apiUrl}/ai-voice/elevenlabs/usage`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (statusRes.ok) setStatus(await statusRes.json());
        if (usageRes.ok) setUsage(await usageRes.json());
      } catch (error) {
        console.error("Error fetching ElevenLabs data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL;

      const response = await fetch(`${apiUrl}/ai-voice/sync-cloned-voices`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao sincronizar vozes");
      }

      const data = await response.json();
      notify(
        `Sincronização concluída! ${data.created || 0} vozes criadas, ${data.updated || 0} atualizadas`,
        { type: "success" },
      );
      refresh();
    } catch (error) {
      notify("Erro ao sincronizar vozes clonadas", { type: "error" });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <Card sx={{ mb: 2, p: 1 }}>
      <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
        <Box display="flex" gap={4} alignItems="center" justifyContent="space-between" flexWrap="wrap">
          {/* Info do Status e Uso */}
          <Box display="flex" gap={4} alignItems="center" flexWrap="wrap" flex={1}>
            {/* Status */}
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                ElevenLabs:
              </Typography>
              <Chip
                label={status?.connected ? "🟢 Conectado" : "🔴 Desconectado"}
                color={status?.connected ? "success" : "error"}
                size="small"
              />
            </Box>

            {/* Uso */}
            {usage && (
              <>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="textSecondary">
                    Caracteres:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {usage.characterCount?.toLocaleString()} /{" "}
                    {usage.characterLimit?.toLocaleString()}
                  </Typography>
                  <Chip 
                    label={`${usage.percentageUsed}%`} 
                    size="small" 
                    color={usage.percentageUsed > 80 ? "warning" : "default"}
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="textSecondary">
                    Tier:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {usage.tier}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="textSecondary">
                    Próximo reset:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {new Date(usage.nextResetDate).toLocaleDateString("pt-BR")}
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          {/* Botão de Sync */}
          <Button
            label="Sincronizar Vozes Com ElevenLabs"
            onClick={handleSync}
            disabled={syncing}
          >
            <SyncIcon />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const AIVoiceFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Nome" source="name" alwaysOn />
    <TextInput label="Categoria" source="category" />
    <TextInput label="Idioma" source="language" />
    <SelectInput
      label="Ativa"
      source="isActive"
      choices={[
        { id: true, name: "Yes" },
        { id: false, name: "No" },
      ]}
      emptyText="All"
    />
    <SelectInput
      label="Premium"
      source="isPremium"
      choices={[
        { id: true, name: "Yes" },
        { id: false, name: "No" },
      ]}
      emptyText="All"
    />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
    <TextInput label="donationPreviewUrl" source="donationPreviewUrl" />
    <TextInput label="salesPreviewUrl" source="salesPreviewUrl" />
    <TextInput label="thumbnailUrl" source="thumbnailUrl" />
  </Filter>
);

const AIVoiceList: React.FC = (props) => (
  <>
    <ElevenLabsStatusWithSync />
    <List
      perPage={25}
      pagination={<DefaultPagination />}
      {...props}
      filters={<AIVoiceFilter />}
      sort={{ field: "createdAt", order: "DESC" }}
    >
      <Datagrid rowClick="edit">
        <TextField source="name" label="Nome" />
        <TextField source="category" label="Categoria" />
        <TextField source="language" label="Idioma" />
        <TextField source="thumbnailUrl" label="Thumbnail" />
        <TextField source="salesPreviewUrl" label="Preview Vendas" />
        <TextField source="donationPreviewUrl" label="Preview Doações" />
        <BooleanField source="isActive" label="Ativa" />
        <BooleanField source="isPremium" label="Premium" />
        <DateField source="createdAt" label="Criado em" />
      </Datagrid>
    </List>
  </>
);

export default AIVoiceList;






