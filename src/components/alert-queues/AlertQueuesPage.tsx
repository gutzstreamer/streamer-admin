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
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEffect, useMemo, useState } from "react";
import { fetchUtils, useNotify } from "react-admin";

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

const tokenHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchJson = (url: string) =>
  fetchUtils.fetchJson(url, {
    headers: {
      Accept: "application/json",
      ...tokenHeader(),
    },
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

  return (
    <Stack spacing={2} padding={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h5">Filas de Alertas (Admin)</Typography>
        {loading && <CircularProgress size={18} />}
        <IconButton onClick={loadOverview} aria-label="reload">
          <RefreshIcon />
        </IconButton>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          size="small"
          label="Buscar streamer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              loadOverview();
            }
          }}
        />
        <IconButton onClick={loadOverview} aria-label="search">
          <VisibilityIcon />
        </IconButton>
      </Stack>

      <Card>
        <CardHeader title="Visão Geral" />
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Streamer</TableCell>
                <TableCell align="center">Paused</TableCell>
                <TableCell align="center">Current</TableCell>
                <TableCell align="center">Queued</TableCell>
                <TableCell align="center">In Progress</TableCell>
                <TableCell align="center">Failed</TableCell>
                <TableCell align="center">Heartbeat</TableCell>
                <TableCell align="center">Display</TableCell>
                <TableCell align="center">Detalhe</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {overview.map((item) => (
                <TableRow key={item.streamerId} hover>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {item.streamerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.streamerId}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {item.state?.paused ? (
                      <PauseCircleFilledIcon color="warning" />
                    ) : (
                      <PlayCircleFilledWhiteIcon color="success" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {item.state?.currentAlertId || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={item.stats.queued}
                      color={item.stats.queued > 0 ? "warning" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={item.stats.inProgress}
                      color={
                        item.stats.inProgress > 0 ? "success" : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={item.stats.failed}
                      color={item.stats.failed > 0 ? "error" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {heartbeatChip(item.state?.lastHeartbeat)}
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {item.state?.activeDisplayId || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => loadDetail(item.streamerId)}
                      aria-label="detail"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedDetail && (
        <Card>
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
      )}
    </Stack>
  );
};

export default AlertQueuesPage;
