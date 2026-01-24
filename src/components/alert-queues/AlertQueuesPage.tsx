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
  Pagination,
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [total, setTotal] = useState(0);
  const notify = useNotify();

  const loadOverview = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (search) params.set("search", search);
      const url = `${apiUrl}/admin/alerts/overview?${params.toString()}`;
      const { json } = await fetchJson(url);
      const response = json as OverviewResponse;
      setOverview(response.items || []);
      setTotal(response.total || 0);
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
  }, [page, pageSize, search]);

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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
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
      <Grid container spacing={{ xs: 1, sm: 1.5 }}>
        {filteredOverview.map((item) => {
          const online =
            item.state?.lastHeartbeat &&
            Date.now() - new Date(item.state.lastHeartbeat).getTime() <= 30_000;
          
          const isPaused = item.state?.paused;
          const hasQueue = item.stats.queued > 0;
          const hasErrors = item.stats.failed > 0;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={item.streamerId}>
              <Card
                elevation={2}
                sx={{
                  position: "relative",
                  transition: "all 0.2s ease",
                  bgcolor: "#1a1a1a",
                  border: isPaused
                    ? "1px solid #ff9800"
                    : !online
                      ? "1px solid #616161"
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
                <CardContent sx={{ p: { xs: 1, sm: 1.25 }, pb: "8px !important" }}>
                  {/* Header Ultra Compacto */}
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    alignItems="center" 
                    mb={1}
                  >
                    <Avatar
                      sx={{
                        bgcolor: online ? "success.main" : "grey.600",
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
                        sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, lineHeight: 1.2 }}
                      >
                        {item.streamerName}
                      </Typography>
                      <Chip
                        icon={isPaused ? <PauseCircleFilledIcon sx={{ fontSize: 10 }} /> : online ? <PlayCircleFilledWhiteIcon sx={{ fontSize: 10 }} /> : undefined}
                        label={isPaused ? "Pausado" : online ? "Online" : "Off"}
                        color={isPaused ? "warning" : online ? "success" : "default"}
                        size="small"
                        sx={{ height: 14, fontSize: "0.6rem", mt: 0.25, "& .MuiChip-label": { px: 0.5 } }}
                      />
                    </Box>
                  </Stack>

                  {/* Métricas Ultra Compactas */}
                  <Grid container spacing={0.5} mb={1}>
                    <Grid item xs={4}>
                      <Box
                        sx={{
                          p: { xs: 0.5, sm: 0.625 },
                          textAlign: "center",
                          bgcolor: hasQueue ? "rgba(255, 152, 0, 0.1)" : "rgba(255,255,255,0.03)",
                          borderRadius: 0.75,
                          border: hasQueue ? "1px solid rgba(255, 152, 0, 0.3)" : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Typography 
                          variant="body1" 
                          fontWeight="700" 
                          color={hasQueue ? "warning.main" : "text.secondary"}
                          sx={{ fontSize: { xs: "0.95rem", sm: "1.05rem" }, lineHeight: 1 }}
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
                          bgcolor: item.stats.inProgress > 0 ? "rgba(76, 175, 80, 0.1)" : "rgba(255,255,255,0.03)",
                          borderRadius: 0.75,
                          border: item.stats.inProgress > 0 ? "1px solid rgba(76, 175, 80, 0.3)" : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight="700"
                          color={item.stats.inProgress > 0 ? "success.main" : "text.secondary"}
                          sx={{ fontSize: { xs: "0.95rem", sm: "1.05rem" }, lineHeight: 1 }}
                        >
                          {item.stats.inProgress}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.6rem", sm: "0.65rem" } }}
                        >
                          Ativo
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box
                        sx={{
                          p: { xs: 0.5, sm: 0.625 },
                          textAlign: "center",
                          bgcolor: hasErrors ? "rgba(244, 67, 54, 0.1)" : "rgba(255,255,255,0.03)",
                          borderRadius: 0.75,
                          border: hasErrors ? "1px solid rgba(244, 67, 54, 0.3)" : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Typography 
                          variant="body1" 
                          fontWeight="700" 
                          color={hasErrors ? "error.main" : "text.secondary"}
                          sx={{ fontSize: { xs: "0.95rem", sm: "1.05rem" }, lineHeight: 1 }}
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

                  {/* Info Mínima - Só heartbeat se online */}
                  {online && item.state?.lastHeartbeat && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: "0.6rem", sm: "0.625rem" },
                        display: "block",
                        textAlign: "center",
                        mb: 0.5
                      }}
                    >
                      {new Date(item.state.lastHeartbeat).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Typography>
                  )}

                  {/* Botão Ver Detalhes Ultra Compacto */}
                  <IconButton
                    component={RouterLink}
                    to={`/alert-queues/${item.streamerId}`}
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

      {/* Paginação */}
      {total > pageSize && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Stack spacing={2} alignItems="center">
            <Pagination
              count={Math.ceil(total / pageSize)}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Itens por página:
              </Typography>
              <Select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                size="small"
                sx={{ minWidth: 80 }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
              <Typography variant="body2" color="text.secondary">
                Total: {total}
              </Typography>
            </Stack>
          </Stack>
        </Box>
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
