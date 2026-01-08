import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Tooltip,
  LinearProgress,
  Switch,
  FormControlLabel,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import QueueIcon from "@mui/icons-material/Queue";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUtils, useNotify } from "react-admin";
import { buildHeaders } from "./utils";

type AlertState = {
  streamerId: string;
  paused: boolean;
  currentAlertId: string | null;
  activeDisplayId: string | null;
  lastHeartbeat: string | null;
  updatedAt: string | null;
};

type AlertStats = {
  streamerId: string;
  queued: number;
  inProgress: number;
  done: number;
  failed: number;
  skipped: number;
  expired: number;
};

type AlertRecord = {
  id: string;
  type: string;
  sourceId: string;
  sourceType: string;
  status: string;
  priority: number;
  payload: any;
  failureReason?: string | null;
  attempts?: number | null;
  createdAt: string;
  updatedAt: string;
};

type DetailResponse = {
  success: boolean;
  streamer: { id: string; name: string };
  state: AlertState | null;
  stats: AlertStats;
  current: AlertRecord | null;
  inProgress?: AlertRecord[];
  queued: AlertRecord[];
  recent: AlertRecord[];
};

const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL;
const adminApi = `${apiUrl}/admin/alerts`;

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
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
    return JSON.stringify(payload).slice(0, 60);
  }, [payload]);
  return <Typography variant="caption" fontSize="0.65rem">{text}</Typography>;
};

const AlertCard = ({
  alert,
  showStatus = false,
  onDelete,
  onRetry,
}: {
  alert: AlertRecord;
  showStatus?: boolean;
  onDelete?: (id: string) => void;
  onRetry?: (id: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "success";
      case "failed":
        return "error";
      case "skipped":
        return "warning";
      case "expired":
        return "default";
      default:
        return "info";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <DoneIcon fontSize="small" />;
      case "failed":
        return <CloseIcon fontSize="small" />;
      case "skipped":
        return <SkipNextIcon fontSize="small" />;
      default:
        return null;
    }
  };

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
            label={alert.type}
            size="small"
            color="primary"
            sx={{ height: 18, fontSize: "0.65rem", px: 0.5 }}
          />
          {showStatus && (
            <Chip
              label={alert.status}
              size="small"
              color={getStatusColor(alert.status)}
              icon={getStatusIcon(alert.status) || undefined}
              sx={{ height: 18, fontSize: "0.65rem", px: 0.5 }}
            />
          )}
        </Stack>
        
        <Box>
          <Typography variant="caption" color="text.secondary" fontSize="0.6rem" display="inline" mr={0.5}>
            ID:
          </Typography>
          <Typography variant="caption" fontFamily="monospace" fontSize="0.65rem" display="inline">
            {alert.id.slice(0, 12)}...
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Box flex={1}>
            <Typography variant="caption" color="text.secondary" fontSize="0.6rem" display="inline" mr={0.5}>
              Fonte:
            </Typography>
            <Typography variant="caption" fontSize="0.7rem" display="inline">
              {alert.sourceType}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" fontSize="0.6rem" display="inline" mr={0.5}>
              Prior:
            </Typography>
            <Chip
              label={alert.priority}
              size="small"
              color={
                alert.priority >= 5
                  ? "error"
                  : alert.priority >= 3
                    ? "warning"
                    : "default"
              }
              sx={{ height: 16, fontSize: "0.6rem", px: 0.5 }}
            />
          </Box>
        </Stack>

        <Box>
          <Typography variant="caption" color="text.secondary" fontSize="0.6rem" mb={0.25}>
            Payload
          </Typography>
          <Box
            sx={{
              p: 0.5,
              bgcolor: "#000",
              borderRadius: 0.5,
              fontSize: "0.65rem",
            }}
          >
            <PayloadPreview payload={alert.payload} />
          </Box>
        </Box>

        {onRetry && alert.status === "failed" && (
          <Button
            fullWidth
            variant="contained"
            color="warning"
            size="small"
            startIcon={<RestartAltIcon sx={{ fontSize: 14 }} />}
            onClick={() => onRetry(alert.id)}
            sx={{
              py: 0.25,
              fontSize: "0.65rem",
              textTransform: "none",
            }}
          >
            Reprocessar
          </Button>
        )}

        {alert.status === "failed" && alert.failureReason && (
          <Box>
            <Typography variant="caption" color="error.main" fontSize="0.6rem" fontWeight="bold">
              ⚠ {alert.failureReason}
            </Typography>
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" fontSize="0.6rem">
          {formatDateTime(showStatus ? alert.updatedAt : alert.createdAt)}
        </Typography>
      </Stack>
    </Paper>
  );
};

const AlertQueueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const [detail, setDetail] = useState<DetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval] = useState(30000); // 30 segundos
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const normalizeAlert = (alert: any): AlertRecord => ({
    ...alert,
    status: (alert?.status || "").toString().toLowerCase(),
    attempts: alert?.attempts ?? 0,
  });

  const loadDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const url = `${apiUrl}/admin/alerts/streamers/${id}`;
      const { json } = await fetchUtils.fetchJson(url, {
        headers: buildHeaders(),
      });
      console.log('🔍 Dados carregados da API:', json);
      console.log('📊 Estatísticas:', json.stats);
      console.log('🎯 Alerta atual:', json.current);
      console.log('⏳ Fila de alertas:', json.queued);
      console.log('✅ Alertas recentes:', json.recent);
      const normalized: DetailResponse = {
        ...(json as DetailResponse),
        current: json.current ? normalizeAlert(json.current) : null,
        inProgress: (json.inProgress || []).map(normalizeAlert),
        queued: (json.queued || []).map(normalizeAlert),
        recent: (json.recent || []).map(normalizeAlert),
      };
      setDetail(normalized);
      setLastUpdate(new Date());
    } catch (error: any) {
      notify(
        `Falha ao carregar detalhes: ${error?.message || "erro desconhecido"}`,
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

  if (!id) return null;

  const online =
    detail?.state?.lastHeartbeat &&
    Date.now() - new Date(detail.state.lastHeartbeat).getTime() <= 30_000;

  const isPaused = detail?.state?.paused;
  const totalAlerts = (detail?.stats.queued || 0) + (detail?.stats.inProgress || 0) + (detail?.stats.failed || 0);
  const progressPercent = totalAlerts > 0 ? ((detail?.stats.done || 0) / ((detail?.stats.done || 0) + totalAlerts)) * 100 : 0;

  // Particiona por status para exibir corretamente cada coluna
  const { queuedAlerts, processingAlerts, processedAlerts } = useMemo(() => {
    if (!detail) {
      return {
        queuedAlerts: [] as AlertRecord[],
        processingAlerts: [] as AlertRecord[],
        processedAlerts: [] as AlertRecord[],
      };
    }

    const queuedAlerts = (detail.queued || []).filter(
      (a) => a.status === "queued",
    );

    const processingAlerts: AlertRecord[] = [];
    const inProgressList = detail.inProgress || [];

    // Adiciona o current se estiver em progresso
    if (detail.current && detail.current.status === "in_progress") {
      processingAlerts.push(detail.current);
    }

    // Adiciona demais em progresso retornados pelo backend
    inProgressList.forEach((a) => {
      if (!processingAlerts.some((p) => p.id === a.id)) {
        processingAlerts.push(a);
      }
    });

    const processedAlerts = (detail.recent || []).filter((a) =>
      ["done", "failed", "skipped", "expired"].includes(a.status),
    );

    return { queuedAlerts, processingAlerts, processedAlerts };
  }, [detail]);

  const requeueStuck = async () => {
    if (!id) return;
    try {
      const url = `${adminApi}/streamers/${id}/requeue-stuck`;
      await fetchUtils.fetchJson(url, {
        method: "POST",
        headers: buildHeaders(),
      });
      notify("Alertas travados reprocessados", { type: "info" });
      loadDetail();
    } catch (error: any) {
      notify(
        `Falha ao reprocessar travados: ${error?.message || "erro desconhecido"}`,
        { type: "error" },
      );
    }
  };

  const retryAlert = async (alertId: string) => {
    try {
      const url = `${apiUrl}/alerts/retry-alert`;
      await fetchUtils.fetchJson(url, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({ alertId }),
      });
      notify("Alerta reprocessado com sucesso", { type: "success" });
      loadDetail();
    } catch (error: any) {
      notify(
        `Falha ao reprocessar alerta: ${error?.message || "erro desconhecido"}`,
        { type: "error" },
      );
    }
  };

  return (
    <Box sx={{ bgcolor: "#0a0a0a", minHeight: "100vh", p: { xs: 1.5, sm: 2 } }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={{ xs: 0.75, sm: 1 }} mb={2}>
        <IconButton
          onClick={() => navigate("/alert-queues")}
          size="small"
          sx={{
            bgcolor: "#1e1e1e",
            "&:hover": { bgcolor: "#2a2a2a" },
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <QueueIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: "primary.main" }} />
        <Typography variant="h6" fontWeight="bold" fontSize={{ xs: "1rem", sm: "1.15rem" }}>
          Detalhes da Fila
        </Typography>
        {loading && <CircularProgress size={16} />}
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Última atualização - oculto em mobile */}
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
              {lastUpdate.toLocaleTimeString()}
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

        <Tooltip title="Reprocessar travados">
          <Button
            variant="outlined"
            color="warning"
            size="small"
            startIcon={<RestartAltIcon />}
            onClick={requeueStuck}
            sx={{ ml: 1 }}
          >
            Reprocessar
          </Button>
        </Tooltip>
      </Stack>

      {detail?.success && detail.streamer && (
        <>
          {/* Card do Streamer */}
          <Card elevation={1} sx={{ mb: 1.5, bgcolor: "#1a1a1a" }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} alignItems="center" mb={1.5}>
                <Avatar
                  sx={{
                    bgcolor: online ? "success.main" : "grey.400",
                    width: { xs: 36, sm: 44 },
                    height: { xs: 36, sm: 44 },
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  {detail.streamer.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold" fontSize={{ xs: "0.95rem", sm: "1.1rem" }}>
                    {detail.streamer.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                    ID: {detail.streamer.id}
                  </Typography>
                </Box>
                <Box>
                  {isPaused ? (
                    <Chip
                      icon={<PauseCircleFilledIcon fontSize="small" />}
                      label="Pausado"
                      color="warning"
                      size="small"
                      sx={{ fontSize: "0.7rem", height: 24 }}
                    />
                  ) : online ? (
                    <Chip
                      icon={<PlayCircleFilledWhiteIcon fontSize="small" />}
                      label="Online"
                      color="success"
                      size="small"
                      sx={{ fontSize: "0.7rem", height: 24 }}
                    />
                  ) : (
                    <Chip
                      label="Offline"
                      color="default"
                      size="small"
                      sx={{ fontSize: "0.7rem", height: 24 }}
                    />
                  )}
                </Box>
              </Stack>

              {/* Barra de Progresso Geral */}
              {totalAlerts > 0 && (
                <Box mb={1.5}>
                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                      Progresso Total
                    </Typography>
                    <Typography variant="caption" fontWeight="bold" fontSize="0.7rem">
                      {detail.stats.done} / {detail.stats.done + totalAlerts}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "#0d0d0d",
                    }}
                  />
                </Box>
              )}

              {/* Informações de Estado */}
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1,
                      bgcolor: "#0d0d0d",
                      borderRadius: 1,
                    }}
                  >
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <ScheduleIcon fontSize="small" color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                          Alerta Atual
                        </Typography>
                        <Typography variant="caption" fontWeight="medium" display="block" fontSize="0.7rem" noWrap>
                          {detail.state?.currentAlertId?.slice(0, 12) || "Nenhum"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1,
                      bgcolor: "#0d0d0d",
                      borderRadius: 1,
                    }}
                  >
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <MonitorHeartIcon fontSize="small" color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                          Display Ativo
                        </Typography>
                        <Typography variant="caption" fontWeight="medium" display="block" fontSize="0.7rem" noWrap>
                          {detail.state?.activeDisplayId?.slice(0, 12) || "N/D"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1,
                      bgcolor: "#0d0d0d",
                      borderRadius: 1,
                    }}
                  >
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <MonitorHeartIcon fontSize="small" color={online ? "success" : "disabled"} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                          Heartbeat
                        </Typography>
                        <Typography variant="caption" fontWeight="medium" display="block" fontSize="0.7rem">
                          {detail.state?.lastHeartbeat
                            ? new Date(detail.state.lastHeartbeat).toLocaleTimeString()
                            : "-"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Estatísticas */}
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
                    <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.7rem" }}>
                      Na Fila
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" fontSize={{ xs: "1.25rem", sm: "1.5rem" }}>
                      {detail.stats.queued}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 32, height: 32 }}>
                    <QueueIcon fontSize="small" />
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
                    <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.7rem" }}>
                      Em Andamento
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" fontSize={{ xs: "1.25rem", sm: "1.5rem" }}>
                      {detail.stats.inProgress}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 32, height: 32 }}>
                    <TrendingUpIcon fontSize="small" />
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
                    <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.7rem" }}>
                      Concluídos
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" fontSize={{ xs: "1.25rem", sm: "1.5rem" }}>
                      {detail.stats.done}
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
                    <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.7rem" }}>
                      Com Falhas
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" fontSize={{ xs: "1.25rem", sm: "1.5rem" }}>
                      {detail.stats.failed}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 32, height: 32 }}>
                    <ErrorOutlineIcon fontSize="small" />
                  </Avatar>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* Visualização de Fila em 3 Colunas */}
          <Grid container spacing={1}>
            {/* Coluna 1: Aguardando na Fila */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={1}
                sx={{
                  bgcolor: "#1a1a1a",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardHeader
                  title={
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <QueueIcon fontSize="small" sx={{ color: "#ff9800" }} />
                      <Typography variant="body1" fontWeight="bold" fontSize="0.9rem">
                        Aguardando
                      </Typography>
                    </Stack>
                  }
                  subheader={
                    <Chip
                      label={`${queuedAlerts.length}`}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255, 152, 0, 0.2)",
                        color: "#ff9800",
                        fontWeight: "bold",
                        height: 20,
                        fontSize: "0.7rem",
                        mt: 0.5,
                      }}
                    />
                  }
                  sx={{
                    p: 1.5,
                    pb: 1,
                    borderBottom: "2px solid #ff9800",
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    overflow: "auto",
                    maxHeight: "65vh",
                    p: 1,
                  }}
                >
                  <Stack spacing={1}>
                    {queuedAlerts.length > 0 ? (
                      queuedAlerts.map((alert, index) => (
                        <Box key={alert.id} position="relative">
                          {index === 0 && (
                            <Chip
                              label="Próx"
                              size="small"
                              color="warning"
                              sx={{
                                position: "absolute",
                                top: -6,
                                right: -6,
                                zIndex: 1,
                                fontWeight: "bold",
                                height: 18,
                                fontSize: "0.65rem",
                              }}
                            />
                          )}
                          <AlertCard alert={alert} />
                        </Box>
                      ))
                    ) : (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          bgcolor: "#0d0d0d",
                          borderRadius: 1,
                        }}
                      >
                        <QueueIcon sx={{ fontSize: 32, color: "grey.700", mb: 0.5 }} />
                        <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                          Nenhum alerta aguardando
                        </Typography>
                      </Paper>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Coluna 2: Processando Agora */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={1}
                sx={{
                  bgcolor: "#1a1a1a",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardHeader
                  title={
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <PlayArrowIcon fontSize="small" sx={{ color: "#f5576c" }} />
                      <Typography variant="body1" fontWeight="bold" fontSize="0.9rem">
                        Processando
                      </Typography>
                    </Stack>
                  }
                  subheader={
                    <Stack direction="row" spacing={0.75} mt={0.5} alignItems="center">
                      <Chip
                        label={`${processingAlerts.length}`}
                        size="small"
                        sx={{
                          bgcolor: processingAlerts.length > 0 ? "rgba(245, 87, 108, 0.2)" : "rgba(158, 158, 158, 0.2)",
                          color: processingAlerts.length > 0 ? "#f5576c" : "grey.500",
                          fontWeight: "bold",
                          height: 20,
                          fontSize: "0.7rem",
                        }}
                      />
                      {processingAlerts.length > 0 && (
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: "#f5576c",
                            animation: "pulse 2s infinite",
                            "@keyframes pulse": {
                              "0%, 100%": { opacity: 1 },
                              "50%": { opacity: 0.3 },
                            },
                          }}
                        />
                      )}
                    </Stack>
                  }
                  sx={{
                    p: 1.5,
                    pb: 1,
                    borderBottom: "2px solid #f5576c",
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    overflow: "auto",
                    maxHeight: "65vh",
                    p: 1,
                  }}
                >
                  {processingAlerts.length > 0 ? (
                    <Stack spacing={1}>
                      {processingAlerts.map((alert, index) => (
                        <Box key={alert.id} position="relative">
                          {index === 0 && (
                            <Chip
                              label="ATUAL"
                              size="small"
                              sx={{
                                position: "absolute",
                                top: -6,
                                right: -6,
                                zIndex: 1,
                                bgcolor: "#f5576c",
                                color: "white",
                                fontWeight: "bold",
                                height: 18,
                                fontSize: "0.65rem",
                                animation: "pulse 2s infinite",
                              }}
                            />
                          )}
                          <AlertCard alert={alert} />
                        </Box>
                      ))}
                      
                      {/* Indicador de fluxo */}
                      <Box
                        sx={{
                          mt: 1,
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ArrowForwardIcon
                          sx={{
                            fontSize: 40,
                            color: "#4caf50",
                            animation: "moveRight 1.5s infinite",
                            "@keyframes moveRight": {
                              "0%, 100%": { transform: "translateX(0)" },
                              "50%": { transform: "translateX(10px)" },
                            },
                          }}
                        />
                      </Box>
                      
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          bgcolor: "rgba(76, 175, 80, 0.1)",
                          border: "1px solid rgba(76, 175, 80, 0.3)",
                        }}
                      >
                        <Typography variant="caption" color="success.main" fontWeight="bold">
                          Será movido para &quot;Processados&quot; ao concluir
                        </Typography>
                      </Paper>
                    </Stack>
                  ) : (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: "center",
                        bgcolor: "#0d0d0d",
                        borderRadius: 1,
                      }}
                    >
                      <PlayArrowIcon sx={{ fontSize: 32, color: "grey.700", mb: 0.5 }} />
                      <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                        Nenhum alerta sendo processado
                      </Typography>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Coluna 3: Processados Recentemente */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={1}
                sx={{
                  bgcolor: "#1a1a1a",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardHeader
                  title={
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <CheckCircleOutlineIcon fontSize="small" sx={{ color: "#00f2fe" }} />
                      <Typography variant="body1" fontWeight="bold" fontSize="0.9rem">
                        Processados
                      </Typography>
                    </Stack>
                  }
                  subheader={
                    <Chip
                      label={`${processedAlerts.length}`}
                      size="small"
                      sx={{
                        bgcolor: "rgba(0, 242, 254, 0.2)",
                        color: "#00f2fe",
                        fontWeight: "bold",
                        height: 20,
                        fontSize: "0.7rem",
                        mt: 0.5,
                      }}
                    />
                  }
                  sx={{
                    p: 1.5,
                    pb: 1,
                    borderBottom: "2px solid #00f2fe",
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    overflow: "auto",
                    maxHeight: "65vh",
                    p: 1,
                  }}
                >
                  <Stack spacing={1}>
                    {processedAlerts.length > 0 ? (
                      processedAlerts.map((alert) => (
                        <AlertCard key={alert.id} alert={alert} showStatus onRetry={retryAlert} />
                      ))
                    ) : (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          bgcolor: "#0d0d0d",
                          borderRadius: 1,
                        }}
                      >
                        <CheckCircleOutlineIcon sx={{ fontSize: 32, color: "grey.700", mb: 0.5 }} />
                        <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                          Nenhum alerta processado recentemente
                        </Typography>
                      </Paper>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default AlertQueueDetailPage;
