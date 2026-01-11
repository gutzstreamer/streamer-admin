import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  Tooltip,
  Typography,
  LinearProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import CancelIcon from "@mui/icons-material/Cancel";
import LockIcon from "@mui/icons-material/Lock";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUtils, useNotify } from "react-admin";
import { buildHeaders } from "../alert-queues/utils";

type MusicthonStats = {
  streamerId: string;
  queued: number;
  playing: number;
  played: number;
  failed: number;
  skipped: number;
  canceled: number;
};

type MusicthonConfig = {
  streamerId: string;
  featureEnabled?: boolean;
  enabled: boolean;
  paused?: boolean;
  provider: string | null;
  minAmount: number;
  highestDonationWins: boolean;
  currentEntryId: string | null;
  updatedAt: string | null;
};

type MusicthonEntry = {
  id: string;
  provider: string;
  trackId: string;
  trackTitle: string;
  trackArtist?: string | null;
  trackAlbum?: string | null;
  trackUrl?: string | null;
  amount: number;
  donorName?: string | null;
  donorMessage?: string | null;
  status: string;
  priority: number;
  attempts?: number | null;
  failureReason?: string | null;
  lockedAt?: string | null;
  lockedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  startedAt?: string | null;
  finishedAt?: string | null;
};

type DetailResponse = {
  success: boolean;
  streamer: { id: string; name: string };
  config: MusicthonConfig | null;
  stats: MusicthonStats;
  current: MusicthonEntry | null;
  playing: MusicthonEntry[];
  queued: MusicthonEntry[];
  recent: MusicthonEntry[];
};

const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL;
const adminApi = `${apiUrl}/admin/musicthon`;

const fetchJson = (url: string) =>
  fetchUtils.fetchJson(url, {
    headers: buildHeaders(),
  });

const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) return "-";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const providerLabel = (provider?: string | null) => {
  if (!provider) return "—";
  if (provider === "YTMUSIC") return "YouTube Music";
  if (provider === "SPOTIFY") return "Spotify";
  return provider;
};

const statusColor = (status: string) => {
  switch (status) {
    case "PLAYING":
      return "success";
    case "QUEUED":
      return "info";
    case "PLAYED":
      return "default";
    case "FAILED":
      return "error";
    case "SKIPPED":
      return "warning";
    case "CANCELED":
      return "default";
    default:
      return "default";
  }
};

const statusIcon = (status: string) => {
  switch (status) {
    case "PLAYING":
      return <GraphicEqIcon fontSize="small" />;
    case "QUEUED":
      return <QueueMusicIcon fontSize="small" />;
    case "PLAYED":
      return <CheckCircleOutlineIcon fontSize="small" />;
    case "FAILED":
      return <ErrorOutlineIcon fontSize="small" />;
    case "SKIPPED":
      return <SkipNextIcon fontSize="small" />;
    case "CANCELED":
      return <CancelIcon fontSize="small" />;
    default:
      return null;
  }
};

const EntryCard = ({
  entry,
  onRetry,
}: {
  entry: MusicthonEntry;
  onRetry?: (id: string) => void;
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 0.75, sm: 1 },
        bgcolor: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "all 0.2s",
        "&:hover": {
          bgcolor: "#1a1a1a",
          borderColor: "rgba(255,255,255,0.15)",
        },
      }}
    >
      <Stack spacing={0.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Chip
            label={providerLabel(entry.provider)}
            size="small"
            color="primary"
            sx={{ height: 18, fontSize: "0.65rem", px: 0.5 }}
          />
          <Chip
            label={entry.status.toLowerCase()}
            size="small"
            color={statusColor(entry.status)}
            icon={statusIcon(entry.status) || undefined}
            sx={{ height: 18, fontSize: "0.65rem", px: 0.5 }}
          />
        </Stack>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontSize="0.6rem"
            display="inline"
            mr={0.5}
          >
            ID:
          </Typography>
          <Typography
            variant="caption"
            fontFamily="monospace"
            fontSize="0.65rem"
            display="inline"
          >
            {entry.id.slice(0, 12)}...
          </Typography>
        </Box>

        <Typography fontWeight={600} fontSize="0.85rem">
          {entry.trackTitle}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
          {entry.trackArtist || entry.trackAlbum || entry.trackId}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
            {entry.donorName || "Anônimo"}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
            {formatCurrency(entry.amount)}
          </Typography>
          {entry.attempts !== undefined && entry.attempts > 1 && (
            <Chip
              size="small"
              label={`tentativas: ${entry.attempts}`}
              variant="outlined"
              color="warning"
              sx={{ height: 16, fontSize: "0.6rem", px: 0.5 }}
            />
          )}
        </Stack>

        {entry.failureReason && (
          <Typography
            variant="caption"
            color="error.main"
            fontSize="0.65rem"
            fontWeight={600}
          >
            ⚠ {entry.failureReason}
          </Typography>
        )}

        {onRetry && entry.status === "FAILED" && (
          <Button
            fullWidth
            variant="contained"
            color="warning"
            size="small"
            startIcon={<RestartAltIcon sx={{ fontSize: 14 }} />}
            onClick={() => onRetry(entry.id)}
            sx={{
              py: 0.25,
              fontSize: "0.65rem",
              textTransform: "none",
            }}
          >
            Reprocessar
          </Button>
        )}

        {entry.lockedAt && (
          <Stack direction="row" spacing={1} alignItems="center">
            <LockIcon fontSize="small" />
            <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
              {entry.lockedBy || "unknown"} • {formatDateTime(entry.lockedAt)}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

const MusicthonQueueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const [detail, setDetail] = useState<DetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [configSaving, setConfigSaving] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval] = useState(30000); // 30 segundos
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const retryEntry = async (entryId: string) => {
    try {
      const url = `${adminApi}/retry-entry`;
      await fetchUtils.fetchJson(url, {
        method: "POST",
        body: JSON.stringify({ entryId }),
        headers: buildHeaders(),
      });
      notify("Música reprocessada com sucesso", { type: "success" });
      await loadDetail();
    } catch (error: any) {
      notify(
        `Falha ao reprocessar música: ${error?.message || "erro desconhecido"}`,
        { type: "error" },
      );
    }
  };


  const updateConfig = async (payload: {
    featureEnabled?: boolean;
    enabled?: boolean;
    paused?: boolean;
  }) => {
    if (!id) return;
    try {
      setConfigSaving(true);
      const url = `${adminApi}/streamers/${id}/config`;
      await fetchUtils.fetchJson(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: buildHeaders(),
      });
      notify("Configuração atualizada", { type: "success" });
      await loadDetail();
    } catch (error: any) {
      notify(
        `Falha ao atualizar config: ${error?.message || "erro desconhecido"}`,
        { type: "error" },
      );
    } finally {
      setConfigSaving(false);
    }
  };

  const loadDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const url = `${adminApi}/streamers/${id}`;
      const { json } = await fetchJson(url);
      setDetail(json as DetailResponse);
      setLastUpdate(new Date());
    } catch (error: any) {
      notify(
        `Falha ao carregar musicthon: ${error?.message || "erro desconhecido"}`,
        { type: "error" },
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Polling automático
  useEffect(() => {
    if (!autoRefresh || !id) return;

    const interval = setInterval(() => {
      loadDetail();
    }, refreshInterval);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, id, refreshInterval]);

  const stats = useMemo(() => detail?.stats, [detail]);

  // Particiona músicas por status para exibir em 3 colunas
  const { queuedEntries, playingEntries, recentEntries } = useMemo(() => {
    if (!detail) {
      return {
        queuedEntries: [] as MusicthonEntry[],
        playingEntries: [] as MusicthonEntry[],
        recentEntries: [] as MusicthonEntry[],
      };
    }

    const queuedEntries = (detail.queued || []).filter(
      (e) => e.status === "QUEUED",
    );

    const playingEntries: MusicthonEntry[] = [];
    
    // Adiciona o current se estiver tocando
    if (detail.current && detail.current.status === "PLAYING") {
      playingEntries.push(detail.current);
    }

    // Adiciona demais tocando retornados pelo backend
    (detail.playing || []).forEach((e) => {
      if (!playingEntries.some((p) => p.id === e.id)) {
        playingEntries.push(e);
      }
    });

    const recentEntries = (detail.recent || []).filter((e) =>
      ["PLAYED", "FAILED", "SKIPPED", "CANCELED"].includes(e.status),
    );

    return { queuedEntries, playingEntries, recentEntries };
  }, [detail]);

  if (!id) return null;

  const online = detail?.config?.enabled && !detail?.config?.paused;
  const isPaused = detail?.config?.paused;
  const totalEntries = (detail?.stats.queued || 0) + (detail?.stats.playing || 0) + (detail?.stats.failed || 0);
  const progressPercent = totalEntries > 0 ? ((detail?.stats.played || 0) / ((detail?.stats.played || 0) + totalEntries)) * 100 : 0;

  if (loading && !detail) {
    return (
      <Box sx={{ bgcolor: "#0a0a0a", minHeight: "100vh", p: { xs: 1.5, sm: 2 } }}>
        <Stack alignItems="center" py={6}>
          <CircularProgress />
        </Stack>
      </Box>
    );
  }

  if (!detail?.success) {
    return (
      <Box sx={{ bgcolor: "#0a0a0a", minHeight: "100vh", p: { xs: 1.5, sm: 2 } }}>
        <Paper elevation={1} sx={{ p: 4, textAlign: "center", bgcolor: "#1a1a1a" }}>
          <Typography color="text.secondary">
            Nenhum detalhe encontrado.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#0a0a0a", minHeight: "100vh", p: { xs: 1.5, sm: 2 } }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={{ xs: 0.75, sm: 1 }} mb={2}>
        <IconButton
          onClick={() => navigate("/musicthon-queues")}
          size="small"
          sx={{
            bgcolor: "#1e1e1e",
            "&:hover": { bgcolor: "#2a2a2a" },
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <MusicNoteIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: "#9c27b0" }} />
        <Typography variant="h6" fontWeight="bold" fontSize={{ xs: "1rem", sm: "1.15rem" }}>
          Musicthon • {detail.streamer.name}
        </Typography>
        {loading && <CircularProgress size={16} />}
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Última atualização */}
        {lastUpdate && (
          <Paper
            elevation={1}
            sx={{
              display: { xs: "none", md: "block" },
              px: 1.5,
              py: 0.5,
              bgcolor: "#1a1a1a",
            }}
          >
            <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
              Atualizado: {lastUpdate.toLocaleTimeString()}
            </Typography>
          </Paper>
        )}
        
        {/* Toggle de Auto-Refresh */}
        <FormControlLabel
          control={
            <Switch
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              color="success"
              size="small"
            />
          }
          label={
            <Typography variant="body2" fontSize="0.75rem">
              Auto
            </Typography>
          }
          sx={{ m: 0, display: { xs: "none", sm: "flex" } }}
        />

        <Tooltip title="Recarregar">
          <IconButton
            onClick={loadDetail}
            color="primary"
            size="small"
            sx={{
              bgcolor: "#1e1e1e",
              "&:hover": { bgcolor: "#2a2a2a" },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Card do Streamer */}
      <Card elevation={1} sx={{ mb: 1.5, bgcolor: "#1a1a1a" }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} alignItems="center" mb={1.5}>
            <Avatar
              sx={{
                bgcolor: online ? "#9c27b0" : isPaused ? "#ff9800" : "grey.600",
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
              }}
            >
              {isPaused ? (
                <PauseCircleFilledIcon />
              ) : online ? (
                <PlayCircleFilledWhiteIcon />
              ) : (
                <MusicNoteIcon />
              )}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6" fontWeight="bold" fontSize={{ xs: "1rem", sm: "1.1rem" }}>
                {detail.streamer.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                ID: {detail.streamer.id}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.5} alignItems="center">
              {!detail.config?.featureEnabled ? (
                <Chip
                  label="Bloqueado"
                  color="default"
                  size="small"
                  sx={{ fontSize: "0.7rem" }}
                />
              ) : !detail.config?.enabled ? (
                <Chip
                  label="Desligado"
                  color="default"
                  size="small"
                  sx={{ fontSize: "0.7rem" }}
                />
              ) : isPaused ? (
                <Chip
                  icon={<PauseCircleFilledIcon fontSize="small" />}
                  label="Pausado"
                  color="warning"
                  size="small"
                  sx={{ fontSize: "0.7rem" }}
                />
              ) : (
                <Chip
                  icon={<PlayCircleFilledWhiteIcon fontSize="small" />}
                  label="Ativo"
                  color="success"
                  size="small"
                  sx={{ fontSize: "0.7rem" }}
                />
              )}
            </Stack>
          </Stack>

          {/* Barra de progresso */}
          {totalEntries > 0 && (
            <Box mb={1.5}>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                  Progresso geral
                </Typography>
                <Typography variant="caption" fontWeight="bold" fontSize="0.7rem">
                  {progressPercent.toFixed(1)}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{
                  height: 6,
                  borderRadius: 1,
                  bgcolor: "rgba(255,255,255,0.05)",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#9c27b0",
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          )}

          {/* Configurações em Grid */}
          <Grid container spacing={1}>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                Provider
              </Typography>
              <Typography variant="body2" fontWeight={600} fontSize="0.8rem">
                {providerLabel(detail.config?.provider)}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                Mínimo
              </Typography>
              <Typography variant="body2" fontWeight={600} fontSize="0.8rem">
                {formatCurrency(detail.config?.minAmount)}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                Prioridade
              </Typography>
              <Typography variant="body2" fontWeight={600} fontSize="0.8rem">
                {detail.config?.highestDonationWins ? "Maior doação" : "Fila padrão"}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                Atualizado
              </Typography>
              <Typography variant="body2" fontWeight={600} fontSize="0.8rem" noWrap>
                {formatDateTime(detail.config?.updatedAt)}
              </Typography>
            </Grid>
          </Grid>

          {/* Switches de configuração */}
          <Divider sx={{ my: 1.5 }} />
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <FormControlLabel
              control={
                <Switch
                  color="primary"
                  checked={detail.config?.featureEnabled ?? false}
                  onChange={(event) =>
                    updateConfig({ featureEnabled: event.target.checked })
                  }
                  disabled={configSaving}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" fontSize="0.75rem">
                  {detail.config?.featureEnabled ? "Feature liberada" : "Feature bloqueada"}
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  color="primary"
                  checked={detail.config?.enabled ?? false}
                  onChange={(event) =>
                    updateConfig({ enabled: event.target.checked })
                  }
                  disabled={configSaving || !detail.config?.featureEnabled}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" fontSize="0.75rem">
                  {detail.config?.enabled ? "Musicthon ativo" : "Musicthon desativado"}
                </Typography>
              }
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Estatísticas com gradientes */}
      <Grid container spacing={1} mb={1.5}>
        <Grid item xs={6} sm={3}>
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5, fontSize: "0.7rem" }}>
                  Na Fila
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats?.queued ?? 0}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 32, height: 32 }}>
                <QueueMusicIcon fontSize="small" />
              </Avatar>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5, fontSize: "0.7rem" }}>
                  Tocando
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats?.playing ?? 0}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 32, height: 32 }}>
                <GraphicEqIcon fontSize="small" />
              </Avatar>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5, fontSize: "0.7rem" }}>
                  Tocadas
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats?.played ?? 0}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 32, height: 32 }}>
                <CheckCircleOutlineIcon fontSize="small" />
              </Avatar>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5, fontSize: "0.7rem" }}>
                  Falhas
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats?.failed ?? 0}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 32, height: 32 }}>
                <ErrorOutlineIcon fontSize="small" />
              </Avatar>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Visualização em 3 Colunas */}
      <Grid container spacing={1}>
        {/* Coluna 1: Fila */}
        <Grid item xs={12} md={4}>
          <Card elevation={1} sx={{ bgcolor: "#1a1a1a", height: "100%" }}>
            <CardHeader
              title={
                <Stack direction="row" spacing={1} alignItems="center">
                  <QueueMusicIcon sx={{ fontSize: 18, color: "#667eea" }} />
                  <Typography variant="subtitle2" fontWeight="bold" fontSize="0.85rem">
                    Fila
                  </Typography>
                  <Chip
                    label={queuedEntries.length}
                    size="small"
                    color="primary"
                    sx={{ height: 18, fontSize: "0.65rem", ml: 0.5 }}
                  />
                </Stack>
              }
              sx={{ py: 1, px: 1.5 }}
            />
            <Divider />
            <CardContent sx={{ p: { xs: 1, sm: 1.25 }, maxHeight: 600, overflowY: "auto" }}>
              <Stack spacing={1}>
                {queuedEntries.length === 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      bgcolor: "#0d0d0d",
                      border: "1px dashed rgba(255,255,255,0.1)",
                    }}
                  >
                    <QueueMusicIcon sx={{ fontSize: 32, color: "grey.600", mb: 1 }} />
                    <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                      Nenhuma música na fila
                    </Typography>
                  </Paper>
                )}
                {queuedEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} onRetry={retryEntry} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Coluna 2: Tocando */}
        <Grid item xs={12} md={4}>
          <Card elevation={1} sx={{ bgcolor: "#1a1a1a", height: "100%" }}>
            <CardHeader
              title={
                <Stack direction="row" spacing={1} alignItems="center">
                  <GraphicEqIcon sx={{ fontSize: 18, color: "#f093fb" }} />
                  <Typography variant="subtitle2" fontWeight="bold" fontSize="0.85rem">
                    Tocando
                  </Typography>
                  <Chip
                    label={playingEntries.length}
                    size="small"
                    color="secondary"
                    sx={{ height: 18, fontSize: "0.65rem", ml: 0.5 }}
                  />
                </Stack>
              }
              sx={{ py: 1, px: 1.5 }}
            />
            <Divider />
            <CardContent sx={{ p: { xs: 1, sm: 1.25 }, maxHeight: 600, overflowY: "auto" }}>
              <Stack spacing={1}>
                {playingEntries.length === 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      bgcolor: "#0d0d0d",
                      border: "1px dashed rgba(255,255,255,0.1)",
                    }}
                  >
                    <GraphicEqIcon sx={{ fontSize: 32, color: "grey.600", mb: 1 }} />
                    <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                      Nenhuma música tocando
                    </Typography>
                  </Paper>
                )}
                {playingEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} onRetry={retryEntry} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Coluna 3: Histórico */}
        <Grid item xs={12} md={4}>
          <Card elevation={1} sx={{ bgcolor: "#1a1a1a", height: "100%" }}>
            <CardHeader
              title={
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#4facfe" }} />
                  <Typography variant="subtitle2" fontWeight="bold" fontSize="0.85rem">
                    Histórico
                  </Typography>
                  <Chip
                    label={recentEntries.length}
                    size="small"
                    color="info"
                    sx={{ height: 18, fontSize: "0.65rem", ml: 0.5 }}
                  />
                </Stack>
              }
              sx={{ py: 1, px: 1.5 }}
            />
            <Divider />
            <CardContent sx={{ p: { xs: 1, sm: 1.25 }, maxHeight: 600, overflowY: "auto" }}>
              <Stack spacing={1}>
                {recentEntries.length === 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      bgcolor: "#0d0d0d",
                      border: "1px dashed rgba(255,255,255,0.1)",
                    }}
                  >
                    <CheckCircleOutlineIcon sx={{ fontSize: 32, color: "grey.600", mb: 1 }} />
                    <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                      Sem histórico recente
                    </Typography>
                  </Paper>
                )}
                {recentEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} onRetry={retryEntry} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Card de Outros Status (se houver) */}
      {(detail.stats?.skipped > 0 || detail.stats?.canceled > 0) && (
        <Card elevation={1} sx={{ mt: 1.5, bgcolor: "#1a1a1a" }}>
          <CardHeader
            title={
              <Typography variant="subtitle2" fontWeight="bold" fontSize="0.85rem">
                Outros Status
              </Typography>
            }
            sx={{ py: 1, px: 1.5 }}
          />
          <Divider />
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                icon={<SkipNextIcon fontSize="small" />}
                label={`Puladas: ${detail.stats?.skipped ?? 0}`}
                size="small"
                color="warning"
                sx={{ fontSize: "0.7rem" }}
              />
              <Chip
                icon={<CancelIcon fontSize="small" />}
                label={`Canceladas: ${detail.stats?.canceled ?? 0}`}
                size="small"
                color="default"
                sx={{ fontSize: "0.7rem" }}
              />
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default MusicthonQueueDetailPage;
