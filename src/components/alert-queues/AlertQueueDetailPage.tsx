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
    return JSON.stringify(payload).slice(0, 80);
  }, [payload]);
  return <Typography variant="body2">{text}</Typography>;
};

const AlertCard = ({ alert, showStatus = false }: { alert: AlertRecord; showStatus?: boolean }) => {
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
      elevation={2}
      sx={{
        p: 2,
        bgcolor: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "all 0.2s",
        "&:hover": {
          bgcolor: "#1a1a1a",
          borderColor: "rgba(255,255,255,0.15)",
        },
      }}
    >
      <Grid container spacing={1.5}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Chip
              label={alert.type}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
            {showStatus && (
              <Chip
                label={alert.status}
                size="small"
                color={getStatusColor(alert.status)}
                icon={getStatusIcon(alert.status) || undefined}
              />
            )}
          </Stack>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary">
            ID
          </Typography>
          <Typography variant="body2" fontFamily="monospace" fontSize="0.75rem">
            {alert.id.slice(0, 16)}...
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">
            Fonte
          </Typography>
          <Typography variant="body2" fontSize="0.85rem">
            {alert.sourceType}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="caption" color="text.secondary">
            Prioridade
          </Typography>
          <Box mt={0.5}>
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
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary">
            Payload
          </Typography>
          <Box
            sx={{
              mt: 0.5,
              p: 1,
              bgcolor: "#000",
              borderRadius: 1,
              fontSize: "0.75rem",
            }}
          >
            <PayloadPreview payload={alert.payload} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary">
            {showStatus ? "Atualizado" : "Criado"}
          </Typography>
          <Typography variant="caption" display="block">
            {formatDateTime(showStatus ? alert.updatedAt : alert.createdAt)}
          </Typography>
        </Grid>
      </Grid>
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
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 segundos

  const loadDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const url = `${apiUrl}/admin/alerts/streamers/${id}`;
      const { json } = await fetchUtils.fetchJson(url, {
        headers: buildHeaders(),
      });
      setDetail(json as DetailResponse);
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

  return (
    <Box sx={{ bgcolor: "#0a0a0a", minHeight: "100vh", p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton
          onClick={() => navigate("/alert-queues")}
          sx={{
            bgcolor: "#1e1e1e",
            "&:hover": { bgcolor: "#2a2a2a" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <QueueIcon sx={{ fontSize: 32, color: "primary.main" }} />
        <Typography variant="h4" fontWeight="bold">
          Detalhes da Fila
        </Typography>
        {loading && <CircularProgress size={24} />}
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Toggle de Auto-Refresh */}
        <Paper
          elevation={1}
          sx={{
            px: 2,
            py: 0.5,
            bgcolor: "#1a1a1a",
            border: autoRefresh ? "1px solid #4caf50" : "1px solid rgba(255,255,255,0.12)",
          }}
        >
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
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">Auto-Refresh</Typography>
                {autoRefresh && (
                  <Chip
                    label={`${refreshInterval / 1000}s`}
                    size="small"
                    color="success"
                    sx={{ height: 20, fontSize: "0.7rem" }}
                  />
                )}
              </Stack>
            }
            sx={{ m: 0 }}
          />
        </Paper>

        <Tooltip title="Recarregar">
          <IconButton
            onClick={loadDetail}
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

      {detail?.success && detail.streamer && (
        <>
          {/* Card do Streamer */}
          <Card elevation={3} sx={{ mb: 3, bgcolor: "#1a1a1a" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={3} alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    bgcolor: online ? "success.main" : "grey.400",
                    width: 64,
                    height: 64,
                    fontSize: "1.5rem",
                  }}
                >
                  {detail.streamer.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {detail.streamer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {detail.streamer.id}
                  </Typography>
                </Box>
                <Box>
                  {isPaused ? (
                    <Chip
                      icon={<PauseCircleFilledIcon />}
                      label="Pausado"
                      color="warning"
                      sx={{ fontSize: "1rem", px: 2, py: 2.5 }}
                    />
                  ) : online ? (
                    <Chip
                      icon={<PlayCircleFilledWhiteIcon />}
                      label="Online"
                      color="success"
                      sx={{ fontSize: "1rem", px: 2, py: 2.5 }}
                    />
                  ) : (
                    <Chip
                      label="Offline"
                      color="default"
                      sx={{ fontSize: "1rem", px: 2, py: 2.5 }}
                    />
                  )}
                </Box>
              </Stack>

              {/* Barra de Progresso Geral */}
              {totalAlerts > 0 && (
                <Box mb={3}>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Progresso Total
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {detail.stats.done} concluídos / {detail.stats.done + totalAlerts} total
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: "#0d0d0d",
                    }}
                  />
                </Box>
              )}

              {/* Informações de Estado */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: "#0d0d0d",
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ScheduleIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Alerta Atual
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" noWrap>
                          {detail.state?.currentAlertId?.slice(0, 12) || "Nenhum"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: "#0d0d0d",
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MonitorHeartIcon color="primary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Display Ativo
                        </Typography>
                        <Typography variant="body2" fontWeight="medium" noWrap>
                          {detail.state?.activeDisplayId?.slice(0, 12) || "N/D"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: "#0d0d0d",
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MonitorHeartIcon color={online ? "success" : "disabled"} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Último Heartbeat
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
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
                      Na Fila
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {detail.stats.queued}
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
                      {detail.stats.inProgress}
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
                      {detail.stats.done}
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
                      {detail.stats.failed}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                    <ErrorOutlineIcon />
                  </Avatar>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* Visualização de Fila em 3 Colunas */}
          <Grid container spacing={2}>
            {/* Coluna 1: Aguardando na Fila */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={3}
                sx={{
                  bgcolor: "#1a1a1a",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardHeader
                  title={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <QueueIcon sx={{ color: "#ff9800" }} />
                      <Typography variant="h6" fontWeight="bold">
                        Aguardando
                      </Typography>
                    </Stack>
                  }
                  subheader={
                    <Stack direction="row" spacing={1} mt={1} alignItems="center">
                      <Chip
                        label={`${detail.queued.length} ${detail.queued.length === 1 ? "alerta" : "alertas"}`}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255, 152, 0, 0.2)",
                          color: "#ff9800",
                          fontWeight: "bold",
                        }}
                      />
                      {detail.queued.length > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          Próximo será processado
                        </Typography>
                      )}
                    </Stack>
                  }
                  sx={{
                    pb: 1,
                    borderBottom: "3px solid #ff9800",
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    overflow: "auto",
                    maxHeight: "70vh",
                  }}
                >
                  <Stack spacing={2}>
                    {detail.queued.length > 0 ? (
                      detail.queued.map((alert, index) => (
                        <Box key={alert.id} position="relative">
                          {index === 0 && (
                            <Chip
                              label="Próximo"
                              size="small"
                              color="warning"
                              sx={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                zIndex: 1,
                                fontWeight: "bold",
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
                          p: 4,
                          textAlign: "center",
                          bgcolor: "#0d0d0d",
                          borderRadius: 2,
                        }}
                      >
                        <QueueIcon sx={{ fontSize: 48, color: "grey.700", mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
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
                elevation={3}
                sx={{
                  bgcolor: "#1a1a1a",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardHeader
                  title={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PlayArrowIcon sx={{ color: "#f5576c" }} />
                      <Typography variant="h6" fontWeight="bold">
                        Processando
                      </Typography>
                    </Stack>
                  }
                  subheader={
                    <Stack direction="row" spacing={1} mt={1} alignItems="center">
                      <Chip
                        label={detail.current ? "1 alerta ativo" : "Nenhum"}
                        size="small"
                        sx={{
                          bgcolor: detail.current ? "rgba(245, 87, 108, 0.2)" : "rgba(158, 158, 158, 0.2)",
                          color: detail.current ? "#f5576c" : "grey.500",
                          fontWeight: "bold",
                        }}
                      />
                      {detail.current && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
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
                    pb: 1,
                    borderBottom: "3px solid #f5576c",
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    overflow: "auto",
                    maxHeight: "70vh",
                  }}
                >
                  {detail.current ? (
                    <Box position="relative">
                      <Chip
                        label="EM EXECUÇÃO"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          zIndex: 1,
                          bgcolor: "#f5576c",
                          color: "white",
                          fontWeight: "bold",
                          animation: "pulse 2s infinite",
                        }}
                      />
                      <AlertCard alert={detail.current} />
                      
                      {/* Indicador de fluxo */}
                      <Box
                        sx={{
                          mt: 3,
                          mb: 2,
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
                    </Box>
                  ) : (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        textAlign: "center",
                        bgcolor: "#0d0d0d",
                        borderRadius: 2,
                      }}
                    >
                      <PlayArrowIcon sx={{ fontSize: 48, color: "grey.700", mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
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
                elevation={3}
                sx={{
                  bgcolor: "#1a1a1a",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardHeader
                  title={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CheckCircleOutlineIcon sx={{ color: "#00f2fe" }} />
                      <Typography variant="h6" fontWeight="bold">
                        Processados
                      </Typography>
                    </Stack>
                  }
                  subheader={
                    <Stack direction="row" spacing={1} mt={1} alignItems="center">
                      <Chip
                        label={`${detail.recent.length} ${detail.recent.length === 1 ? "alerta" : "alertas"}`}
                        size="small"
                        sx={{
                          bgcolor: "rgba(0, 242, 254, 0.2)",
                          color: "#00f2fe",
                          fontWeight: "bold",
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Histórico recente
                      </Typography>
                    </Stack>
                  }
                  sx={{
                    pb: 1,
                    borderBottom: "3px solid #00f2fe",
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    overflow: "auto",
                    maxHeight: "70vh",
                  }}
                >
                  <Stack spacing={2}>
                    {detail.recent.length > 0 ? (
                      detail.recent.map((alert) => (
                        <AlertCard key={alert.id} alert={alert} showStatus />
                      ))
                    ) : (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 4,
                          textAlign: "center",
                          bgcolor: "#0d0d0d",
                          borderRadius: 2,
                        }}
                      >
                        <CheckCircleOutlineIcon sx={{ fontSize: 48, color: "grey.700", mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
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
