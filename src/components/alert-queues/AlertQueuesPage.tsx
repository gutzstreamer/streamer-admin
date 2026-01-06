import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Avatar,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Badge,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import QueueIcon from "@mui/icons-material/Queue";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useEffect, useMemo, useState } from "react";
import { fetchUtils, useNotify } from "react-admin";
import { Link as RouterLink } from "react-router-dom";
import { buildHeaders } from "./utils";

type AlertStats = {
  streamerId: string;
  queued: number;
  inProgress: number;
  done: number;
  failed: number;
  skipped: number;
  expired: number;
};

type AlertState = {
  streamerId: string;
  paused: boolean;
  currentAlertId: string | null;
  activeDisplayId: string | null;
  lastHeartbeat: string | null;
  updatedAt: string | null;
};

type OverviewItem = {
  streamerId: string;
  streamerName: string;
  state: AlertState;
  stats: AlertStats;
};

type OverviewResponse = {
  total: number;
  page: number;
  pageSize: number;
  items: OverviewItem[];
};

type AlertRecord = {
  id: string;
  type: string;
  sourceId: string;
  sourceType: string;
  status: string;
  priority: number;
  payload: any;
  createdAt: string;
  updatedAt: string;
};

type DetailResponse = {
  success: boolean;
  streamer: { id: string; name: string };
  state: AlertState | null;
  stats: AlertStats;
  current: AlertRecord | null;
  queued: AlertRecord[];
  recent: AlertRecord[];
};

const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL;

const fetchJson = (url: string) =>
  fetchUtils.fetchJson(url, {
    headers: buildHeaders(),
  });

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const heartbeatChip = (lastHeartbeat?: string | null) => {
  if (!lastHeartbeat) {
    return <Chip size="small" label="offline" color="default" />;
  }
  const last = new Date(lastHeartbeat).getTime();
  const diffSeconds = (Date.now() - last) / 1000;
  if (diffSeconds <= 30) {
    return <Chip size="small" label="online" color="success" />;
  }
  if (diffSeconds <= 120) {
    return <Chip size="small" label="degraded" color="warning" />;
  }
  return <Chip size="small" label="offline" color="default" />;
};

const PayloadPreview = ({ payload }: { payload: any }) => {
  const text = useMemo(() => {
    if (!payload) return "-";
    if (payload.username && payload.amount) {
      return `${payload.username} - R$ ${payload.amount}`;
    }
    if (payload.productStreamerName && payload.total) {
      return `${payload.productStreamerName} - R$ ${payload.total}`;
    }
    return JSON.stringify(payload).slice(0, 80);
  }, [payload]);
  return <Typography variant="body2">{text}</Typography>;
};

const AlertQueuesPage = () => {
  const [overview, setOverview] = useState<OverviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("queued");
  const [selectedDetail, setSelectedDetail] = useState<DetailResponse | null>(
    null,
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const notify = useNotify();

  const loadOverview = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: "1",
        pageSize: "50",
      });
      if (search) params.set("search", search);
      const url = `${apiUrl}/admin/alerts/overview?${params.toString()}`;
      const { json } = await fetchJson(url);
      const data = (json as OverviewResponse).items || [];
      setOverview(data);
    } catch (error: any) {
      notify(
        `Falha ao carregar filas: ${error?.message || "erro desconhecido"}`,
        { type: "error" },
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (streamerId: string) => {
    try {
      setDetailLoading(true);
      const url = `${apiUrl}/admin/alerts/streamers/${streamerId}`;
      const { json } = await fetchJson(url);
      setSelectedDetail(json as DetailResponse);
    } catch (error: any) {
      notify(
        `Falha ao carregar detalhes: ${error?.message || "erro desconhecido"}`,
        { type: "error" },
      );
    } finally {
      setDetailLoading(false);
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
        acc.inProgress += item.stats.inProgress;
        acc.failed += item.stats.failed;
        acc.done += item.stats.done;
        acc.skipped += item.stats.skipped;
        return acc;
      },
      { queued: 0, inProgress: 0, failed: 0, done: 0, skipped: 0 },
    );
  }, [overview]);

  const filteredOverview = useMemo(() => {
    let filtered = [...overview];

    // Aplicar filtros
    if (filterStatus === "online") {
      filtered = filtered.filter((item) => {
        if (!item.state?.lastHeartbeat) return false;
        const diffMs = Date.now() - new Date(item.state.lastHeartbeat).getTime();
        return diffMs <= 30_000;
      });
    } else if (filterStatus === "offline") {
      filtered = filtered.filter((item) => {
        if (!item.state?.lastHeartbeat) return true;
        const diffMs = Date.now() - new Date(item.state.lastHeartbeat).getTime();
        return diffMs > 30_000;
      });
    } else if (filterStatus === "paused") {
      filtered = filtered.filter((item) => item.state?.paused);
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
        case "inProgress":
          return b.stats.inProgress - a.stats.inProgress;
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
        <QueueIcon sx={{ fontSize: 32, color: "primary.main" }} />
        <Typography variant="h4" fontWeight="bold">
          Filas de Alertas
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
                <QueueIcon />
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
                  Em Andamento
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {totals.inProgress}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                <TrendingUpIcon />
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
                  Concluídos
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  {totals.done}
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
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
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
                <MenuItem value="inProgress">Em Andamento</MenuItem>
                <MenuItem value="name">Nome (A-Z)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Lista de Streamers em Cards */}
      <Grid container spacing={2.5}>
        {filteredOverview.map((item) => {
          const online =
            item.state?.lastHeartbeat &&
            Date.now() - new Date(item.state.lastHeartbeat).getTime() <= 30_000;
          
          const isPaused = item.state?.paused;
          const hasQueue = item.stats.queued > 0;
          const hasErrors = item.stats.failed > 0;
          
          const totalAlerts = item.stats.queued + item.stats.inProgress + item.stats.failed;

          return (
            <Grid item xs={12} sm={6} lg={4} key={item.streamerId}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  position: "relative",
                  transition: "all 0.3s ease",
                  bgcolor: "#1a1a1a",
                  border: isPaused
                    ? "2px solid #ff9800"
                    : !online
                      ? "2px solid #9e9e9e"
                      : hasErrors
                        ? "2px solid #f44336"
                        : "2px solid transparent",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                {/* Badge de Status */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 1,
                  }}
                >
                  {isPaused ? (
                    <Chip
                      icon={<PauseCircleFilledIcon />}
                      label="Pausado"
                      color="warning"
                      size="small"
                    />
                  ) : online ? (
                    <Chip
                      icon={<PlayCircleFilledWhiteIcon />}
                      label="Online"
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip label="Offline" size="small" color="default" />
                  )}
                </Box>

                <CardContent sx={{ pb: 1.5 }}>
                  {/* Header do Card */}
                  <Stack direction="row" spacing={2} alignItems="flex-start" mb={2} pr={10}>
                    <Avatar
                      sx={{
                        bgcolor: online ? "success.main" : "grey.400",
                        width: 48,
                        height: 48,
                      }}
                    >
                      {item.streamerName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        noWrap
                        sx={{ mb: 0.5 }}
                      >
                        {item.streamerName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        ID: {item.streamerId}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Métricas Principais */}
                  <Grid container spacing={1.5} mb={2}>
                    <Grid item xs={4}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          textAlign: "center",
                          bgcolor: hasQueue ? "rgba(255, 152, 0, 0.15)" : "#0d0d0d",
                          borderColor: hasQueue ? "rgba(255, 152, 0, 0.3)" : "rgba(255,255,255,0.12)",
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold" color={hasQueue ? "warning.main" : "text.secondary"}>
                          {item.stats.queued}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Na Fila
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          textAlign: "center",
                          bgcolor: item.stats.inProgress > 0 ? "rgba(76, 175, 80, 0.15)" : "#0d0d0d",
                          borderColor: item.stats.inProgress > 0 ? "rgba(76, 175, 80, 0.3)" : "rgba(255,255,255,0.12)",
                        }}
                      >
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          color={item.stats.inProgress > 0 ? "success.main" : "text.secondary"}
                        >
                          {item.stats.inProgress}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Ativo
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          textAlign: "center",
                          bgcolor: hasErrors ? "rgba(244, 67, 54, 0.15)" : "#0d0d0d",
                          borderColor: hasErrors ? "rgba(244, 67, 54, 0.3)" : "rgba(255,255,255,0.12)",
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold" color={hasErrors ? "error.main" : "text.secondary"}>
                          {item.stats.failed}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Falhas
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Barra de Progresso */}
                  {totalAlerts > 0 && (
                    <Box mb={2}>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Atividade
                        </Typography>
                        <Typography variant="caption" fontWeight="bold">
                          {totalAlerts} alertas
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={totalAlerts > 0 ? (item.stats.done / (item.stats.done + totalAlerts)) * 100 : 0}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  )}

                  <Divider sx={{ my: 1.5 }} />

                  {/* Informações Adicionais */}
                  <Stack spacing={1}>
                    {item.state?.currentAlertId && (
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          Alerta Atual:
                        </Typography>
                        <Chip
                          label={item.state.currentAlertId.slice(0, 8)}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.7rem" }}
                        />
                      </Stack>
                    )}
                    {item.state?.activeDisplayId && (
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          Display:
                        </Typography>
                        <Chip
                          label={item.state.activeDisplayId.slice(0, 8)}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.7rem" }}
                        />
                      </Stack>
                    )}
                    {item.state?.lastHeartbeat && (
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          Último Heartbeat:
                        </Typography>
                        <Typography variant="caption" fontWeight="medium">
                          {new Date(item.state.lastHeartbeat).toLocaleTimeString()}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

                {/* Botão de Ver Detalhes */}
                <Box sx={{ p: 1.5, bgcolor: "#0d0d0d" }}>
                  <IconButton
                    component={RouterLink}
                    to={`/alert-queues/${item.streamerId}`}
                    fullWidth
                    sx={{
                      width: "100%",
                      borderRadius: 1,
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    <VisibilityIcon sx={{ mr: 1 }} />
                    <Typography variant="button">Ver Detalhes</Typography>
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredOverview.length === 0 && !loading && (
        <Paper
          elevation={1}
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "#1a1a1a",
          }}
        >
          <QueueIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum streamer encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tente ajustar os filtros ou realizar uma nova busca
          </Typography>
        </Paper>
      )}

      {/* Seção de Detalhes (mantida do código original) */}
      {selectedDetail && (
        <Box mt={4}>
          <Card elevation={3} sx={{ bgcolor: "#1a1a1a" }}>
            <CardHeader
              title={`Detalhes - ${selectedDetail.streamer.name}`}
              subheader={`ID: ${selectedDetail.streamer.id}`}
            />
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Chip
                  label={selectedDetail.state?.paused ? "Pausado" : "Ativo"}
                  color={selectedDetail.state?.paused ? "warning" : "success"}
                />
                <Chip
                  label={`Atual: ${
                    selectedDetail.state?.currentAlertId || "nenhum"
                  }`}
                />
                <Chip
                  label={`Display: ${
                    selectedDetail.state?.activeDisplayId || "n/d"
                  }`}
                />
                <Chip
                  label={`Heartbeat: ${formatDateTime(
                    selectedDetail.state?.lastHeartbeat || null,
                  )}`}
                />
                {detailLoading && <CircularProgress size={18} />}
              </Stack>

              <Typography variant="subtitle1">Em Andamento</Typography>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  {selectedDetail.current ? (
                    <>
                      <Typography variant="body2">
                        ID: {selectedDetail.current.id}
                      </Typography>
                      <Typography variant="body2">
                        Tipo: {selectedDetail.current.type} | Fonte:{" "}
                        {selectedDetail.current.sourceType} (
                        {selectedDetail.current.sourceId})
                      </Typography>
                      <Typography variant="body2">
                        Prioridade: {selectedDetail.current.priority} | Status:{" "}
                        {selectedDetail.current.status}
                      </Typography>
                      <PayloadPreview payload={selectedDetail.current.payload} />
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Nenhum alerta em progresso
                    </Typography>
                  )}
                </CardContent>
              </Card>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1">Fila (próximos)</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Fonte</TableCell>
                    <TableCell>Prioridade</TableCell>
                    <TableCell>Payload</TableCell>
                    <TableCell>Criado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedDetail.queued.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.id}</TableCell>
                      <TableCell>{a.type}</TableCell>
                      <TableCell>
                        {a.sourceType} ({a.sourceId})
                      </TableCell>
                      <TableCell>{a.priority}</TableCell>
                      <TableCell>
                        <PayloadPreview payload={a.payload} />
                      </TableCell>
                      <TableCell>{formatDateTime(a.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                  {selectedDetail.queued.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary">
                          Sem alertas na fila
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1">Recentes</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Fonte</TableCell>
                    <TableCell>Payload</TableCell>
                    <TableCell>Atualizado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedDetail.recent.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.id}</TableCell>
                      <TableCell>{a.status}</TableCell>
                      <TableCell>{a.type}</TableCell>
                      <TableCell>
                        {a.sourceType} ({a.sourceId})
                      </TableCell>
                      <TableCell>
                        <PayloadPreview payload={a.payload} />
                      </TableCell>
                      <TableCell>{formatDateTime(a.updatedAt)}</TableCell>
                    </TableRow>
                  ))}
                  {selectedDetail.recent.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary">
                          Nenhum alerta recente
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default AlertQueuesPage;
