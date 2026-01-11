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
  Tooltip,
  Typography,
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

  const loadDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const url = `${adminApi}/streamers/${id}`;
      const { json } = await fetchJson(url);
      setDetail(json as DetailResponse);
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

  const stats = useMemo(() => detail?.stats, [detail]);

  if (loading && !detail) {
    return (
      <Stack alignItems="center" py={6}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!detail?.success) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">
          Nenhum detalhe encontrado.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={() => navigate("/musicthon-queues")}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {detail.streamer.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {detail.streamer.id}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Atualizar">
            <IconButton color="primary" onClick={loadDetail}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ bgcolor: "#3b82f6" }}>
                  <QueueMusicIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Em fila
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {stats?.queued ?? 0}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ bgcolor: "#22c55e" }}>
                  <GraphicEqIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tocando
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {stats?.playing ?? 0}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ bgcolor: "#10b981" }}>
                  <CheckCircleOutlineIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tocadas
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {stats?.played ?? 0}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ bgcolor: "#ef4444" }}>
                  <ErrorOutlineIcon />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Falhas
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {stats?.failed ?? 0}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardHeader title="Configuração atual" />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">
                Status
              </Typography>
              <Typography fontWeight={600}>
                {!detail.config?.enabled
                  ? "Desligado"
                  : detail.config?.paused
                    ? "Pausado"
                    : "Ativo"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">
                Provider
              </Typography>
              <Typography fontWeight={600}>
                {providerLabel(detail.config?.provider)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">
                Mínimo
              </Typography>
              <Typography fontWeight={600}>
                {formatCurrency(detail.config?.minAmount)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">
                Prioridade
              </Typography>
              <Typography fontWeight={600}>
                {detail.config?.highestDonationWins
                  ? "Maior doação"
                  : "Fila padrão"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">
                Atualizado
              </Typography>
              <Typography fontWeight={600}>
                {formatDateTime(detail.config?.updatedAt)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">
                Current Entry ID
              </Typography>
              <Typography fontWeight={600}>
                {detail.config?.currentEntryId || "—"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Tocando agora" />
            <Divider />
            <CardContent>
              {detail.current ? (
                <EntryCard entry={detail.current} onRetry={retryEntry} />
              ) : (
                <Typography color="text.secondary">
                  Nenhuma música tocando.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title={
                <Stack direction="row" spacing={1} alignItems="center">
                  <QueueMusicIcon fontSize="small" />
                  <Typography>Fila</Typography>
                </Stack>
              }
            />
            <Divider />
            <CardContent>
              <Stack spacing={1.5}>
                {detail.queued.length === 0 && (
                  <Typography color="text.secondary">
                    Fila vazia.
                  </Typography>
                )}
                {detail.queued.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} onRetry={retryEntry} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title={
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleOutlineIcon fontSize="small" />
                  <Typography>Histórico recente</Typography>
                </Stack>
              }
            />
            <Divider />
            <CardContent>
              <Stack spacing={1.5}>
                {detail.recent.length === 0 && (
                  <Typography color="text.secondary">
                    Sem histórico.
                  </Typography>
                )}
                {detail.recent.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} onRetry={retryEntry} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {detail.playing?.length > 0 && (
        <Card>
          <CardHeader
            title={
              <Stack direction="row" spacing={1} alignItems="center">
                <GraphicEqIcon fontSize="small" />
                <Typography>Em execução</Typography>
              </Stack>
            }
          />
          <Divider />
          <CardContent>
            <Stack spacing={1.5}>
              {detail.playing.map((entry) => (
                <EntryCard key={entry.id} entry={entry} onRetry={retryEntry} />
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {detail.stats?.skipped > 0 || detail.stats?.canceled > 0 ? (
        <Card>
          <CardHeader title="Outros status" />
          <Divider />
          <CardContent>
            <Stack direction="row" spacing={1}>
              <Chip
                icon={<SkipNextIcon fontSize="small" />}
                label={`Puladas: ${detail.stats?.skipped ?? 0}`}
              />
              <Chip
                icon={<CancelIcon fontSize="small" />}
                label={`Canceladas: ${detail.stats?.canceled ?? 0}`}
              />
            </Stack>
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
};

export default MusicthonQueueDetailPage;
