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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
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
  enabled: boolean;
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

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
      >
        <Stack>
          <Typography variant="h5" fontWeight={700}>
            Musicthon • Filas por streamer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Acompanhe o que está tocando, em fila e histórico.
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            placeholder="Buscar streamer..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" />,
            }}
          />
          <Tooltip title="Atualizar lista">
            <IconButton color="primary" onClick={loadOverview}>
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
                    {totals.queued}
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
                    {totals.playing}
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
                    {totals.played}
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
                    {totals.failed}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardHeader
          title="Streamers"
          action={
            loading ? (
              <CircularProgress size={20} />
            ) : (
              <Badge badgeContent={overview.length} color="primary">
                <MusicNoteIcon />
              </Badge>
            )
          }
        />
        <Divider />
        <CardContent>
          {loading ? (
            <Stack alignItems="center" py={4}>
              <CircularProgress />
            </Stack>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Streamer</TableCell>
                  <TableCell>Musicthon</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Min. valor</TableCell>
                  <TableCell>Prioridade</TableCell>
                  <TableCell>Resumo</TableCell>
                  <TableCell>Lock</TableCell>
                  <TableCell>Atualizado</TableCell>
                  <TableCell align="right">Detalhes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {overview.map((item) => (
                  <TableRow key={item.streamerId} hover>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography fontWeight={600}>
                          {item.streamerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.streamerId}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={item.config?.enabled ? "success" : "default"}
                        label={item.config?.enabled ? "ativo" : "desligado"}
                      />
                    </TableCell>
                    <TableCell>{providerLabel(item.config?.provider)}</TableCell>
                    <TableCell>
                      {formatCurrency(item.config?.minAmount)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={
                          item.config?.highestDonationWins ? "warning" : "info"
                        }
                        label={
                          item.config?.highestDonationWins
                            ? "maior doação"
                            : "fila padrão"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          size="small"
                          icon={<QueueMusicIcon fontSize="small" />}
                          label={item.stats.queued}
                        />
                        <Chip
                          size="small"
                          icon={<GraphicEqIcon fontSize="small" />}
                          color="success"
                          label={item.stats.playing}
                        />
                        {item.stats.failed > 0 ? (
                          <Tooltip
                            title={
                              formatFailureTooltip(item.lastFailed) ||
                              "Falhas recentes"
                            }
                          >
                            <Chip
                              size="small"
                              icon={<ErrorOutlineIcon fontSize="small" />}
                              color="error"
                              label={item.stats.failed}
                            />
                          </Tooltip>
                        ) : (
                          <Chip
                            size="small"
                            icon={<ErrorOutlineIcon fontSize="small" />}
                            color="default"
                            label={item.stats.failed}
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
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
                          />
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(item.config?.updatedAt)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver detalhes">
                        <IconButton
                          component={RouterLink}
                          to={`/musicthon-queues/${item.streamerId}`}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {!loading && overview.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            Nenhum streamer encontrado.
          </Typography>
        </Paper>
      )}
    </Stack>
  );
};

export default MusicthonQueuesPage;
