import {
  Avatar,
  Badge,
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
  Stack,
  TextField,
  Tooltip,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import LockIcon from "@mui/icons-material/Lock";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useEffect, useMemo, useState } from "react";
import { fetchUtils, useNotify } from "react-admin";
import { Link as RouterLink } from "react-router-dom";
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

type CurrentEntryLock = {
  id: string;
  lockedAt: string | null;
  lockedBy: string | null;
};

type LastFailed = {
  reason: string | null;
  at: string | null;
};

type OverviewItem = {
  streamerId: string;
  streamerName: string;
  config: MusicthonConfig;
  currentEntry?: CurrentEntryLock | null;
  lastFailed?: LastFailed | null;
  stats: MusicthonStats;
};

type OverviewResponse = {
  total: number;
  page: number;
  pageSize: number;
  items: OverviewItem[];
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

const formatLockLabel = (lock?: CurrentEntryLock | null) => {
  if (!lock?.lockedAt) return "—";
  return "locked";
};

const formatFailureTooltip = (lastFailed?: LastFailed | null) => {
  if (!lastFailed) return null;
  const parts = [];
  if (lastFailed.reason) parts.push(lastFailed.reason);
  if (lastFailed.at) parts.push(formatDateTime(lastFailed.at));
  return parts.length ? parts.join(" • ") : null;
};

const MusicthonQueuesPage = () => {
  const [overview, setOverview] = useState<OverviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("queued");
  const notify = useNotify();

  const loadOverview = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: "1", pageSize: "50" });
      if (search) params.set("search", search);
      const url = `${adminApi}/overview?${params.toString()}`;
      const { json } = await fetchJson(url);
      const data = (json as OverviewResponse).items || [];
      setOverview(data);
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
    loadOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(() => {
    return overview.reduce(
      (acc, item) => {
        acc.queued += item.stats.queued;
        acc.playing += item.stats.playing;
        acc.played += item.stats.played;
        acc.failed += item.stats.failed;
        return acc;
      },
      { queued: 0, playing: 0, played: 0, failed: 0 },
    );
  }, [overview]);

  const filteredOverview = useMemo(() => {
    let filtered = [...overview];

    // Aplicar filtros
    if (filterStatus === "enabled") {
      filtered = filtered.filter((item) => item.config?.enabled);
    } else if (filterStatus === "disabled") {
      filtered = filtered.filter((item) => !item.config?.enabled);
    } else if (filterStatus === "paused") {
      filtered = filtered.filter((item) => item.config?.paused);
    } else if (filterStatus === "withQueue") {
      filtered = filtered.filter((item) => item.stats.queued > 0);
    } else if (filterStatus === "withErrors") {
      filtered = filtered.filter((item) => item.stats.failed > 0);
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "queued":
          return b.stats.queued - a.stats.queued;
        case "failed":
          return b.stats.failed - a.stats.failed;
        case "playing":
          return b.stats.playing - a.stats.playing;
        case "name":
          return a.streamerName.localeCompare(b.streamerName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [overview, filterStatus, sortBy]);

  return (
    <Box sx={{ bgcolor: "#0a0a0a", minHeight: "100vh", p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <MusicNoteIcon sx={{ fontSize: 32, color: "primary.main" }} />
        <Typography variant="h4" fontWeight="bold">
          Filas de Musicthon
        </Typography>
        <Chip
          label={`${filteredOverview.length} streamers`}
          color="primary"
          variant="outlined"
        />
        {loading && <CircularProgress size={24} />}
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Recarregar">
          <IconButton
            onClick={loadOverview}
            color="primary"
            sx={{
              bgcolor: "#1e1e1e",
              "&:hover": { bgcolor: "#2a2a2a" },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Dashboard de Métricas */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                  Total na Fila
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {totals.queued}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                <QueueMusicIcon />
              </Avatar>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                  Tocando Agora
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {totals.playing}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                <GraphicEqIcon />
              </Avatar>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                  Tocadas
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {totals.played}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                <CheckCircleOutlineIcon />
              </Avatar>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                  Com Falhas
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {totals.failed}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                <ErrorOutlineIcon />
              </Avatar>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Filtros e Busca */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, bgcolor: "#1a1a1a" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar streamer por nome ou ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  loadOverview();
                }
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
              }}
              sx={{ bgcolor: "#0d0d0d" }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
                startAdornment={<FilterListIcon sx={{ ml: 1, mr: -0.5, color: "action.active" }} />}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="enabled">Habilitados</MenuItem>
                <MenuItem value="disabled">Desabilitados</MenuItem>
                <MenuItem value="paused">Pausados</MenuItem>
                <MenuItem value="withQueue">Com Fila</MenuItem>
                <MenuItem value="withErrors">Com Erros</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                label="Ordenar por"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="queued">Maior Fila</MenuItem>
                <MenuItem value="failed">Mais Falhas</MenuItem>
                <MenuItem value="playing">Tocando</MenuItem>
                <MenuItem value="name">Nome (A-Z)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Lista de Streamers em Cards */}
      <Grid container spacing={{ xs: 1, sm: 1.5 }}>
        {filteredOverview.map((item) => {
                const isEnabled = !!item.config?.enabled;
                const isPaused = !!item.config?.paused;
                const hasQueue = item.stats.queued > 0;
                const hasErrors = item.stats.failed > 0;
                const failureTooltip = formatFailureTooltip(item.lastFailed);

                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2.4}
                    key={item.streamerId}
                  >
                    <Card
                      elevation={2}
                      sx={{
                        position: "relative",
                        transition: "all 0.2s ease",
                        bgcolor: "#1a1a1a",
                        border: !isEnabled
                          ? "1px solid #616161"
                          : isPaused
                            ? "1px solid #ff9800"
                            : hasErrors
                              ? "1px solid #f44336"
                              : "1px solid rgba(255,255,255,0.12)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 4,
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      <CardContent
                        sx={{ p: { xs: 1, sm: 1.25 }, pb: "8px !important" }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                          <Avatar
                            sx={{
                              bgcolor: isEnabled ? "success.main" : "grey.600",
                              width: { xs: 28, sm: 32 },
                              height: { xs: 28, sm: 32 },
                              fontSize: { xs: "0.85rem", sm: "0.95rem" },
                            }}
                          >
                            {item.streamerName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                              variant="subtitle2"
                              fontWeight="600"
                              noWrap
                              sx={{
                                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                lineHeight: 1.2,
                              }}
                            >
                              {item.streamerName}
                            </Typography>
                            <Chip
                              icon={
                                isPaused ? (
                                  <PauseCircleFilledIcon sx={{ fontSize: 10 }} />
                                ) : isEnabled ? (
                                  <PlayCircleFilledWhiteIcon sx={{ fontSize: 10 }} />
                                ) : undefined
                              }
                              label={
                                !isEnabled
                                  ? "Off"
                                  : isPaused
                                    ? "Pausado"
                                    : "Ativo"
                              }
                              color={
                                !isEnabled
                                  ? "default"
                                  : isPaused
                                    ? "warning"
                                    : "success"
                              }
                              size="small"
                              sx={{
                                height: 14,
                                fontSize: "0.6rem",
                                mt: 0.25,
                                "& .MuiChip-label": { px: 0.5 },
                              }}
                            />
                          </Box>
                        </Stack>

                        <Grid container spacing={0.5} mb={1}>
                          <Grid item xs={4}>
                            <Box
                              sx={{
                                p: { xs: 0.5, sm: 0.625 },
                                textAlign: "center",
                                bgcolor: hasQueue
                                  ? "rgba(255, 152, 0, 0.1)"
                                  : "rgba(255,255,255,0.03)",
                                borderRadius: 0.75,
                                border: hasQueue
                                  ? "1px solid rgba(255, 152, 0, 0.3)"
                                  : "1px solid rgba(255,255,255,0.08)",
                              }}
                            >
                              <Typography
                                variant="body1"
                                fontWeight="700"
                                color={hasQueue ? "warning.main" : "text.secondary"}
                                sx={{
                                  fontSize: { xs: "0.95rem", sm: "1.05rem" },
                                  lineHeight: 1,
                                }}
                              >
                                {item.stats.queued}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: { xs: "0.6rem", sm: "0.65rem" } }}
                              >
                                Fila
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box
                              sx={{
                                p: { xs: 0.5, sm: 0.625 },
                                textAlign: "center",
                                bgcolor:
                                  item.stats.playing > 0
                                    ? "rgba(76, 175, 80, 0.1)"
                                    : "rgba(255,255,255,0.03)",
                                borderRadius: 0.75,
                                border:
                                  item.stats.playing > 0
                                    ? "1px solid rgba(76, 175, 80, 0.3)"
                                    : "1px solid rgba(255,255,255,0.08)",
                              }}
                            >
                              <Typography
                                variant="body1"
                                fontWeight="700"
                                color={
                                  item.stats.playing > 0
                                    ? "success.main"
                                    : "text.secondary"
                                }
                                sx={{
                                  fontSize: { xs: "0.95rem", sm: "1.05rem" },
                                  lineHeight: 1,
                                }}
                              >
                                {item.stats.playing}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: { xs: "0.6rem", sm: "0.65rem" } }}
                              >
                                Tocando
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box
                              sx={{
                                p: { xs: 0.5, sm: 0.625 },
                                textAlign: "center",
                                bgcolor: hasErrors
                                  ? "rgba(244, 67, 54, 0.1)"
                                  : "rgba(255,255,255,0.03)",
                                borderRadius: 0.75,
                                border: hasErrors
                                  ? "1px solid rgba(244, 67, 54, 0.3)"
                                  : "1px solid rgba(255,255,255,0.08)",
                              }}
                            >
                              <Typography
                                variant="body1"
                                fontWeight="700"
                                color={hasErrors ? "error.main" : "text.secondary"}
                                sx={{
                                  fontSize: { xs: "0.95rem", sm: "1.05rem" },
                                  lineHeight: 1,
                                }}
                              >
                                {item.stats.failed}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: { xs: "0.6rem", sm: "0.65rem" } }}
                              >
                                Falhas
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        <Stack spacing={0.5} mb={1}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.6rem", sm: "0.65rem" } }}
                          >
                            {providerLabel(item.config?.provider)} • mínimo{" "}
                            {formatCurrency(item.config?.minAmount)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.6rem", sm: "0.65rem" } }}
                          >
                            {item.config?.highestDonationWins
                              ? "Maior doação"
                              : "Fila padrão"}
                          </Typography>
                        </Stack>

                        {item.currentEntry?.lockedAt ? (
                          <Tooltip
                            title={
                              <Stack spacing={0.5}>
                                <Typography variant="caption">
                                  {item.currentEntry.lockedBy || "unknown"}
                                </Typography>
                                <Typography variant="caption">
                                  {formatDateTime(item.currentEntry.lockedAt)}
                                </Typography>
                              </Stack>
                            }
                          >
                            <Chip
                              size="small"
                              icon={<LockIcon fontSize="small" />}
                              label={formatLockLabel(item.currentEntry)}
                              color="warning"
                              sx={{ height: 16, fontSize: "0.6rem" }}
                            />
                          </Tooltip>
                        ) : null}

                        {failureTooltip && (
                          <Tooltip title={failureTooltip}>
                            <Chip
                              size="small"
                              icon={<ErrorOutlineIcon fontSize="small" />}
                              label="Falha recente"
                              color="error"
                              sx={{ height: 16, fontSize: "0.6rem" }}
                            />
                          </Tooltip>
                        )}

                        <IconButton
                          component={RouterLink}
                          to={`/musicthon-queues/${item.streamerId}`}
                          size="small"
                          sx={{
                            width: "100%",
                            py: { xs: 0.375, sm: 0.5 },
                            borderRadius: 0.75,
                            bgcolor: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "primary.main",
                            "&:hover": {
                              bgcolor: "primary.main",
                              color: "white",
                              borderColor: "primary.main",
                            },
                          }}
                        >
                          <VisibilityIcon sx={{ fontSize: { xs: 14, sm: 16 }, mr: 0.5 }} />
                          <Typography
                            variant="caption"
                            fontWeight="600"
                            sx={{ fontSize: { xs: "0.65rem", sm: "0.7rem" } }}
                          >
                            Detalhes
                          </Typography>
                        </IconButton>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {!loading && filteredOverview.length === 0 && (
              <Paper sx={{ p: 4, textAlign: "center", bgcolor: "#1a1a1a", mt: 2 }}>
                <Typography color="text.secondary">
                  Nenhum streamer encontrado.
                </Typography>
              </Paper>
            )}
          </Box>
  );
};

export default MusicthonQueuesPage;
