import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import QueueIcon from "@mui/icons-material/Queue";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import NotesIcon from "@mui/icons-material/Notes";
import LinkIcon from "@mui/icons-material/Link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useEffect, useMemo, useState } from "react";
import { fetchUtils, useNotify } from "react-admin";
import { Link as RouterLink } from "react-router-dom";
import { buildHeaders } from "../alert-queues/utils";

type AlertState = {
  paused: boolean;
  currentAlertId: string | null;
  activeDisplayId: string | null;
  lastHeartbeat: string | null;
  updatedAt: string | null;
};

type AlertStats = {
  queued: number;
  inProgress: number;
  done: number;
  failed: number;
  skipped: number;
  expired: number;
};

type AlertOverviewItem = {
  streamerId: string;
  streamerName: string;
  streamerAtname?: string | null;
  streamerImage?: string | null;
  state: AlertState;
  stats: AlertStats;
  streamerAvatarUrl?: string | null;
};

type AlertOverviewResponse = {
  items: AlertOverviewItem[];
};

type MusicthonConfig = {
  enabled: boolean;
  paused?: boolean;
  provider: string | null;
  currentEntryId: string | null;
  updatedAt: string | null;
};

type MusicthonStats = {
  queued: number;
  playing: number;
  played: number;
  failed: number;
  skipped: number;
  canceled: number;
};

type MusicOverviewItem = {
  streamerId: string;
  streamerName: string;
  streamerAtname?: string | null;
  streamerImage?: string | null;
  config: MusicthonConfig;
  stats: MusicthonStats;
  streamerAvatarUrl?: string | null;
};

type MusicOverviewResponse = {
  items: MusicOverviewItem[];
};

type ControlCenterStreamer = {
  streamerId: string;
  streamerName: string;
  streamerAtname: string | null;
  avatarUrl: string | null;
  alerts?: AlertOverviewItem;
  musicthon?: MusicOverviewItem;
};

type OverlayDisplayInfo = {
  displayId: string;
  platform: string | null;
  deviceLabel: string | null;
  clientVersion: string | null;
  room: string | null;
  widgetType: string | null;
  widgetInstanceId: string | null;
  connected: boolean;
  active: boolean;
  role: "primary" | "mirror";
  lastHeartbeatAt: string | null;
  lastSeenAt: string | null;
  connectedSockets: number;
};

type OverlayDisplayListResponse = {
  primaryDisplayId: string | null;
  data: OverlayDisplayInfo[];
};

type OverlayWidgetLinkInfo = {
  widgetType: string;
  widgetInstanceId: string;
  variant: string | null;
  obsLink: string | null;
  enabled: boolean;
  overlayPathV2: string | null;
  overlayPathLegacy: string | null;
};

type OverlayWidgetLinkListResponse = {
  streamerId: string;
  data: OverlayWidgetLinkInfo[];
};

type TabKey = "alerts" | "musicthon" | "widgets" | "displays" | "logs";

const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL;
const FONT_FAMILY =
  '"Space Grotesk", "Manrope", "Avenir Next", "Segoe UI", sans-serif';

const pageSx = {
  minHeight: "100vh",
  p: { xs: 1.75, md: 3 },
  fontFamily: FONT_FAMILY,
  background:
    "radial-gradient(1100px circle at 0% 0%, rgba(51,137,255,0.22), transparent 38%), radial-gradient(900px circle at 100% 0%, rgba(16,185,129,0.14), transparent 34%), linear-gradient(180deg, #05070d 0%, #070b13 100%)",
};

const panelCardSx = {
  bgcolor: "rgba(11, 16, 28, 0.78)",
  border: "1px solid rgba(118, 153, 220, 0.28)",
  borderRadius: 3,
  backdropFilter: "blur(10px)",
  boxShadow:
    "0 28px 60px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
};

const sectionSurfaceSx = {
  bgcolor: "rgba(8, 13, 24, 0.82)",
  border: "1px solid rgba(128, 159, 221, 0.24)",
  borderRadius: 2,
  boxShadow:
    "0 10px 24px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.03)",
};

const listItemSx = (isSelected: boolean) => ({
  p: 1.3,
  cursor: "pointer",
  borderRadius: 2,
  border: isSelected
    ? "1px solid rgba(90, 159, 255, 0.72)"
    : "1px solid rgba(255,255,255,0.08)",
  bgcolor: isSelected ? "rgba(31, 92, 203, 0.28)" : "rgba(8, 12, 21, 0.85)",
  boxShadow: isSelected
    ? "0 12px 26px rgba(17, 86, 219, 0.28)"
    : "0 8px 18px rgba(0, 0, 0, 0.24)",
  transition: "all .22s ease",
  "&:hover": {
    transform: "translateY(-1px)",
    borderColor: isSelected
      ? "rgba(90, 159, 255, 0.82)"
      : "rgba(159, 187, 245, 0.42)",
    bgcolor: isSelected ? "rgba(31, 92, 203, 0.34)" : "rgba(13, 19, 34, 0.92)",
  },
});

const fetchJson = (url: string) =>
  fetchUtils.fetchJson(url, {
    headers: buildHeaders(),
  });

const toIsoDateTime = (value?: string | null) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
};

const isHeartbeatOnline = (lastHeartbeat?: string | null) => {
  if (!lastHeartbeat) return false;
  return Date.now() - new Date(lastHeartbeat).getTime() <= 30_000;
};

const normalizeBaseUrl = (value: string) => {
  const normalized = value.trim();
  if (!normalized) return "";
  return normalized.replace(/\/+$/, "");
};

const buildAbsoluteUrl = (baseUrl: string, path: string | null) => {
  if (!path) return null;
  const normalizedBase = normalizeBaseUrl(baseUrl);
  if (!normalizedBase) return path;
  return `${normalizedBase}${path.startsWith("/") ? path : `/${path}`}`;
};

const resolveAvatar = (source: any): string | null => {
  const candidates = [
    source?.streamerImage,
    source?.streamerAvatarUrl,
    source?.streamerPhotoUrl,
    source?.streamerImageUrl,
    source?.avatarUrl,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return null;
};

const mergeQueueOverviews = (
  alerts: AlertOverviewItem[],
  musicthon: MusicOverviewItem[],
): ControlCenterStreamer[] => {
  const merged = new Map<string, ControlCenterStreamer>();

  for (const alertItem of alerts) {
    merged.set(alertItem.streamerId, {
      streamerId: alertItem.streamerId,
      streamerName: alertItem.streamerName || `Streamer ${alertItem.streamerId}`,
      streamerAtname: alertItem.streamerAtname ?? null,
      avatarUrl: resolveAvatar(alertItem),
      alerts: alertItem,
    });
  }

  for (const musicItem of musicthon) {
    const existing = merged.get(musicItem.streamerId);
    if (existing) {
      existing.musicthon = musicItem;
      if (!existing.avatarUrl) {
        existing.avatarUrl = resolveAvatar(musicItem);
      }
      if (!existing.streamerName && musicItem.streamerName) {
        existing.streamerName = musicItem.streamerName;
      }
      if (!existing.streamerAtname && musicItem.streamerAtname) {
        existing.streamerAtname = musicItem.streamerAtname;
      }
      continue;
    }

    merged.set(musicItem.streamerId, {
      streamerId: musicItem.streamerId,
      streamerName: musicItem.streamerName || `Streamer ${musicItem.streamerId}`,
      streamerAtname: musicItem.streamerAtname ?? null,
      avatarUrl: resolveAvatar(musicItem),
      musicthon: musicItem,
    });
  }

  return [...merged.values()].sort((a, b) =>
    a.streamerName.localeCompare(b.streamerName),
  );
};

const QueueControlCenterPage = () => {
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectingPrimaryDisplayId, setSelectingPrimaryDisplayId] =
    useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TabKey>("alerts");
  const [streamers, setStreamers] = useState<ControlCenterStreamer[]>([]);
  const [selectedStreamerId, setSelectedStreamerId] = useState<string | null>(
    null,
  );
  const [overlayBaseUrl, setOverlayBaseUrl] = useState<string>("");
  const [overlayDisplays, setOverlayDisplays] = useState<OverlayDisplayInfo[]>([]);
  const [primaryDisplayId, setPrimaryDisplayId] = useState<string | null>(null);
  const [widgetLinks, setWidgetLinks] = useState<OverlayWidgetLinkInfo[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [alertsResponse, musicthonResponse] = await Promise.all([
        fetchJson(`${apiUrl}/admin/alerts/overview?page=1&pageSize=500`),
        fetchJson(`${apiUrl}/admin/musicthon/overview?page=1&pageSize=500`),
      ]);

      const alertItems = (alertsResponse.json as AlertOverviewResponse).items || [];
      const musicItems =
        (musicthonResponse.json as MusicOverviewResponse).items || [];
      const merged = mergeQueueOverviews(alertItems, musicItems);
      setStreamers(merged);

      if (!selectedStreamerId && merged.length > 0) {
        setSelectedStreamerId(merged[0].streamerId);
      }
      if (
        selectedStreamerId &&
        !merged.some((item) => item.streamerId === selectedStreamerId)
      ) {
        setSelectedStreamerId(merged[0]?.streamerId || null);
      }
    } catch (error: any) {
      notify(
        `Falha ao carregar queue control center: ${error?.message || "erro desconhecido"}`,
        { type: "error" },
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedOverlayBaseUrl = localStorage.getItem(
      "queue-control-overlay-base-url",
    );
    if (savedOverlayBaseUrl) {
      setOverlayBaseUrl(savedOverlayBaseUrl);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("queue-control-overlay-base-url", overlayBaseUrl);
  }, [overlayBaseUrl]);

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOverlayDetails = async (streamerId: string) => {
    try {
      setOverlayLoading(true);
      const [displaysResponse, linksResponse] = await Promise.all([
        fetchJson(`${apiUrl}/overlay/v1/streamers/${streamerId}/displays`),
        fetchJson(`${apiUrl}/overlay/v1/streamers/${streamerId}/widgets-links`),
      ]);

      const displays =
        (displaysResponse.json as OverlayDisplayListResponse).data || [];
      const widgetLinkData =
        (linksResponse.json as OverlayWidgetLinkListResponse).data || [];
      const sortedWidgetLinks = [...widgetLinkData].sort((a, b) => {
        const typeCompare = a.widgetType.localeCompare(b.widgetType);
        if (typeCompare !== 0) return typeCompare;
        return (a.variant || "").localeCompare(b.variant || "");
      });

      setOverlayDisplays(displays);
      setPrimaryDisplayId(
        (displaysResponse.json as OverlayDisplayListResponse).primaryDisplayId ??
          null,
      );
      setWidgetLinks(sortedWidgetLinks);
    } catch (error: any) {
      setOverlayDisplays([]);
      setPrimaryDisplayId(null);
      setWidgetLinks([]);
      notify(
        `Falha ao carregar dados de overlay: ${error?.message || "erro desconhecido"}`,
        { type: "warning" },
      );
    } finally {
      setOverlayLoading(false);
    }
  };

  const filteredStreamers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return streamers;

    return streamers.filter((item) => {
      return (
        item.streamerName.toLowerCase().includes(normalizedSearch) ||
        (item.streamerAtname || "").toLowerCase().includes(normalizedSearch) ||
        item.streamerId.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [search, streamers]);

  const selectedStreamer = useMemo(() => {
    if (!selectedStreamerId) return filteredStreamers[0] || null;
    return (
      filteredStreamers.find((item) => item.streamerId === selectedStreamerId) ||
      streamers.find((item) => item.streamerId === selectedStreamerId) ||
      null
    );
  }, [filteredStreamers, selectedStreamerId, streamers]);

  useEffect(() => {
    if (!selectedStreamer?.streamerId) {
      setOverlayDisplays([]);
      setPrimaryDisplayId(null);
      setWidgetLinks([]);
      return;
    }

    void loadOverlayDetails(selectedStreamer.streamerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStreamer?.streamerId]);

  const totals = useMemo(() => {
    return streamers.reduce(
      (acc, item) => {
        acc.alertQueued += item.alerts?.stats.queued || 0;
        acc.alertFailed += item.alerts?.stats.failed || 0;
        acc.musicQueued += item.musicthon?.stats.queued || 0;
        acc.musicFailed += item.musicthon?.stats.failed || 0;
        return acc;
      },
      { alertQueued: 0, alertFailed: 0, musicQueued: 0, musicFailed: 0 },
    );
  }, [streamers]);

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      notify(`${label} copiado`, { type: "success" });
    } catch {
      notify(`Não foi possível copiar ${label.toLowerCase()}`, {
        type: "warning",
      });
    }
  };

  const openOverlayPath = (path: string | null) => {
    const absoluteUrl = buildAbsoluteUrl(overlayBaseUrl, path);
    if (!absoluteUrl) {
      notify("Link indisponível para este widget", { type: "warning" });
      return;
    }
    window.open(absoluteUrl, "_blank", "noopener,noreferrer");
  };

  const supportsPrimarySelection = (widgetType?: string | null) => {
    const normalizedType = (widgetType || "").toLowerCase();
    return normalizedType === "donation" || normalizedType === "store";
  };

  const refreshSelectedStreamerData = async () => {
    await loadData();
    if (selectedStreamer?.streamerId) {
      await loadOverlayDetails(selectedStreamer.streamerId);
    }
  };

  const callAdminAlertAction = async (
    action: "pause" | "resume" | "skip-current" | "clear-queue" | "requeue-stuck",
    successMessage: string,
  ) => {
    if (!selectedStreamer?.streamerId) return;

    const loadingKey = `alert:${action}`;
    try {
      setActionLoading(loadingKey);
      await fetchUtils.fetchJson(
        `${apiUrl}/admin/alerts/streamers/${selectedStreamer.streamerId}/${action}`,
        {
          method: "POST",
          headers: buildHeaders(),
        },
      );
      notify(successMessage, { type: "success" });
      await refreshSelectedStreamerData();
    } catch (error: any) {
      notify(
        `Falha na ação de alerta: ${error?.message || "erro desconhecido"}`,
        { type: "error" },
      );
    } finally {
      setActionLoading(null);
    }
  };

  const updateMusicthonPaused = async (paused: boolean) => {
    if (!selectedStreamer?.streamerId) return;

    const loadingKey = paused ? "musicthon:pause" : "musicthon:resume";
    try {
      setActionLoading(loadingKey);
      await fetchUtils.fetchJson(
        `${apiUrl}/admin/musicthon/streamers/${selectedStreamer.streamerId}/config`,
        {
          method: "POST",
          headers: buildHeaders(),
          body: JSON.stringify({ paused }),
        },
      );
      notify(
        paused ? "Musicthon pausado com sucesso" : "Musicthon retomado com sucesso",
        { type: "success" },
      );
      await refreshSelectedStreamerData();
    } catch (error: any) {
      notify(
        `Falha na ação do musicthon: ${error?.message || "erro desconhecido"}`,
        { type: "error" },
      );
    } finally {
      setActionLoading(null);
    }
  };

  const setPrimaryDisplay = async (display: OverlayDisplayInfo) => {
    if (!selectedStreamer?.streamerId) {
      return;
    }
    if (!display.connected) {
      notify("Display offline não pode ser primary", { type: "warning" });
      return;
    }
    if (!display.widgetInstanceId) {
      notify("Display sem widgetInstanceId válido", { type: "warning" });
      return;
    }
    if (!supportsPrimarySelection(display.widgetType)) {
      notify("Primary disponível apenas para donation/store", { type: "warning" });
      return;
    }

    try {
      setSelectingPrimaryDisplayId(display.displayId);

      const url = `${apiUrl}/overlay/v1/widgets/${display.widgetInstanceId}/primary-display`;
      await fetchUtils.fetchJson(url, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({ displayId: display.displayId }),
      });

      notify("Display principal atualizado", { type: "success" });
      await loadOverlayDetails(selectedStreamer.streamerId);
      await loadData();
    } catch (error: any) {
      notify(
        `Falha ao definir primary: ${error?.message || "erro desconhecido"}`,
        { type: "error" },
      );
    } finally {
      setSelectingPrimaryDisplayId(null);
    }
  };

  return (
    <Box sx={pageSx}>
      <Stack
        direction="row"
        spacing={1.2}
        alignItems="center"
        mb={2.5}
        flexWrap="wrap"
      >
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            letterSpacing: "-0.02em",
            textShadow: "0 8px 28px rgba(59,130,246,0.24)",
          }}
        >
          Queue Control Center
        </Typography>
        <Chip
          label={`${streamers.length} streamers`}
          color="primary"
          sx={{ borderRadius: 1.5, fontWeight: 700 }}
        />
        <Chip
          label={`Alert queued: ${totals.alertQueued}`}
          color={totals.alertQueued > 0 ? "warning" : "success"}
          variant="outlined"
          sx={{ borderRadius: 1.5, fontWeight: 600 }}
        />
        <Chip
          label={`Music queued: ${totals.musicQueued}`}
          color={totals.musicQueued > 0 ? "warning" : "success"}
          variant="outlined"
          sx={{ borderRadius: 1.5, fontWeight: 600 }}
        />
        <Box sx={{ flexGrow: 1 }} />
        {loading && <CircularProgress size={22} />}
        <Tooltip title="Recarregar">
          <IconButton
            onClick={() => void loadData()}
            color="primary"
            sx={{
              bgcolor: "rgba(37, 99, 235, 0.14)",
              border: "1px solid rgba(96, 165, 250, 0.34)",
              "&:hover": {
                bgcolor: "rgba(37, 99, 235, 0.24)",
              },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4} lg={3.5}>
          <Card sx={panelCardSx}>
            <CardContent>
              <TextField
                size="small"
                fullWidth
                placeholder="Buscar streamer por nome ou ID"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, fontSize: 18 }} />,
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(9, 14, 25, 0.76)",
                    borderRadius: 2,
                  },
                }}
              />

              <Stack spacing={1} sx={{ maxHeight: "68vh", overflowY: "auto", pr: 0.5 }}>
                {filteredStreamers.map((item) => {
                  const isSelected = selectedStreamer?.streamerId === item.streamerId;
                  const alertQueued = item.alerts?.stats.queued || 0;
                  const musicQueued = item.musicthon?.stats.queued || 0;
                  const alertsOnline = isHeartbeatOnline(item.alerts?.state?.lastHeartbeat);

                  return (
                    <Paper
                      key={item.streamerId}
                      onClick={() => setSelectedStreamerId(item.streamerId)}
                      sx={listItemSx(isSelected)}
                    >
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Avatar src={item.avatarUrl || undefined}>
                          {item.streamerName.slice(0, 1).toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight={700} noWrap>
                            {item.streamerName}
                          </Typography>
                          {item.streamerAtname && (
                            <Typography variant="caption" color="text.secondary" noWrap>
                              @{item.streamerAtname}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {item.streamerId}
                          </Typography>
                          <Stack direction="row" spacing={0.75} mt={0.6} flexWrap="wrap">
                            <Chip
                              size="small"
                              icon={<QueueIcon />}
                              label={`A: ${alertQueued}`}
                              color={alertQueued > 0 ? "warning" : "default"}
                            />
                            <Chip
                              size="small"
                              icon={<MusicNoteIcon />}
                              label={`M: ${musicQueued}`}
                              color={musicQueued > 0 ? "warning" : "default"}
                            />
                            <Chip
                              size="small"
                              label={alertsOnline ? "online" : "offline"}
                              color={alertsOnline ? "success" : "default"}
                            />
                          </Stack>
                        </Box>
                      </Stack>
                    </Paper>
                  );
                })}

                {!loading && filteredStreamers.length === 0 && (
                  <Paper sx={{ ...sectionSurfaceSx, p: 2, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhum streamer encontrado.
                    </Typography>
                  </Paper>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8} lg={8.5}>
          <Card sx={panelCardSx}>
            <CardContent>
              {!selectedStreamer && (
                <Typography variant="body1" color="text.secondary">
                  Selecione um streamer para visualizar as filas.
                </Typography>
              )}

              {selectedStreamer && (
                <>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    mb={1}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={selectedStreamer.avatarUrl || undefined} sx={{ width: 42, height: 42 }}>
                        {selectedStreamer.streamerName.slice(0, 1).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {selectedStreamer.streamerName}
                        </Typography>
                        {selectedStreamer.streamerAtname && (
                          <Typography variant="caption" color="text.secondary">
                            @{selectedStreamer.streamerAtname}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {selectedStreamer.streamerId}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        component={RouterLink}
                        to={`/alert-queues/${selectedStreamer.streamerId}`}
                        endIcon={<OpenInNewIcon />}
                      >
                        Abrir Alertas
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        component={RouterLink}
                        to={`/musicthon-queues/${selectedStreamer.streamerId}`}
                        endIcon={<OpenInNewIcon />}
                      >
                        Abrir Musicthon
                      </Button>
                    </Stack>
                  </Stack>

                  <Divider sx={{ mb: 1.6, borderColor: "rgba(122, 156, 219, 0.26)" }} />

                  <Tabs
                    value={tab}
                    onChange={(_, nextValue: TabKey) => setTab(nextValue)}
                    variant="scrollable"
                    allowScrollButtonsMobile
                    sx={{
                      mb: 2,
                      minHeight: 40,
                      "& .MuiTabs-indicator": {
                        height: 3,
                        borderRadius: 99,
                        backgroundColor: "#4f9dff",
                      },
                      "& .MuiTab-root": {
                        minHeight: 38,
                        textTransform: "none",
                        borderRadius: 99,
                        mr: 1,
                        color: "rgba(219, 231, 255, 0.7)",
                        fontWeight: 600,
                      },
                      "& .Mui-selected": {
                        color: "#f8fbff",
                        backgroundColor: "rgba(79,157,255,0.16)",
                      },
                    }}
                  >
                    <Tab value="alerts" label="Alertas" icon={<QueueIcon />} iconPosition="start" />
                    <Tab value="musicthon" label="Musicthon" icon={<MusicNoteIcon />} iconPosition="start" />
                    <Tab value="widgets" label="Widgets" icon={<LinkIcon />} iconPosition="start" />
                    <Tab value="displays" label="Displays" icon={<MonitorHeartIcon />} iconPosition="start" />
                    <Tab value="logs" label="Logs" icon={<NotesIcon />} iconPosition="start" />
                  </Tabs>

                  {tab === "alerts" && (
                    <Grid container spacing={1.25}>
                      <Grid item xs={12} sm={6} md={4}>
                        <MetricCard
                          label="Queued"
                          value={selectedStreamer.alerts?.stats.queued || 0}
                          color="#f59e0b"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <MetricCard
                          label="In Progress"
                          value={selectedStreamer.alerts?.stats.inProgress || 0}
                          color="#3b82f6"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <MetricCard
                          label="Failed"
                          value={selectedStreamer.alerts?.stats.failed || 0}
                          color="#ef4444"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Paper sx={{ ...sectionSurfaceSx, p: 1.2 }}>
                          <Typography variant="body2">
                            Status:
                            <Chip
                              size="small"
                              label={selectedStreamer.alerts?.state?.paused ? "paused" : "running"}
                              color={selectedStreamer.alerts?.state?.paused ? "warning" : "success"}
                              sx={{ ml: 1 }}
                            />
                          </Typography>
                          <Typography variant="body2" mt={1}>
                            Último heartbeat:{" "}
                            <strong>
                              {toIsoDateTime(selectedStreamer.alerts?.state?.lastHeartbeat)}
                            </strong>
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper sx={{ ...sectionSurfaceSx, p: 1.2 }}>
                          <Typography variant="body2" mb={1}>
                            Ações operacionais
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Button
                              size="small"
                              variant="outlined"
                              color="warning"
                              disabled={
                                !!actionLoading || !!selectedStreamer.alerts?.state?.paused
                              }
                              onClick={() =>
                                void callAdminAlertAction(
                                  "pause",
                                  "Fila de alertas pausada",
                                )
                              }
                            >
                              {actionLoading === "alert:pause" ? "Pausando..." : "Pausar fila"}
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              disabled={
                                !!actionLoading || !selectedStreamer.alerts?.state?.paused
                              }
                              onClick={() =>
                                void callAdminAlertAction(
                                  "resume",
                                  "Fila de alertas retomada",
                                )
                              }
                            >
                              {actionLoading === "alert:resume" ? "Retomando..." : "Retomar fila"}
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              disabled={
                                !!actionLoading ||
                                !selectedStreamer.alerts?.state?.currentAlertId
                              }
                              onClick={() =>
                                void callAdminAlertAction(
                                  "skip-current",
                                  "Alerta atual pulado",
                                )
                              }
                            >
                              {actionLoading === "alert:skip-current"
                                ? "Pulando..."
                                : "Pular atual"}
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              disabled={
                                !!actionLoading ||
                                (selectedStreamer.alerts?.stats.queued || 0) <= 0
                              }
                              onClick={() =>
                                void callAdminAlertAction(
                                  "clear-queue",
                                  "Fila de alertas limpa",
                                )
                              }
                            >
                              {actionLoading === "alert:clear-queue"
                                ? "Limpando..."
                                : "Limpar fila"}
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              disabled={!!actionLoading}
                              onClick={() =>
                                void callAdminAlertAction(
                                  "requeue-stuck",
                                  "Alertas travados foram reprocessados",
                                )
                              }
                            >
                              {actionLoading === "alert:requeue-stuck"
                                ? "Reprocessando..."
                                : "Reprocessar travados"}
                            </Button>
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>
                  )}

                  {tab === "musicthon" && (
                    <Grid container spacing={1.25}>
                      <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                          label="Queued"
                          value={selectedStreamer.musicthon?.stats.queued || 0}
                          color="#f59e0b"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                          label="Playing"
                          value={selectedStreamer.musicthon?.stats.playing || 0}
                          color="#22c55e"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                          label="Failed"
                          value={selectedStreamer.musicthon?.stats.failed || 0}
                          color="#ef4444"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                          label="Played"
                          value={selectedStreamer.musicthon?.stats.played || 0}
                          color="#06b6d4"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Paper sx={{ ...sectionSurfaceSx, p: 1.2 }}>
                          <Typography variant="body2">
                            Provider:{" "}
                            <strong>
                              {selectedStreamer.musicthon?.config?.provider || "-"}
                            </strong>
                          </Typography>
                          <Typography variant="body2" mt={1}>
                            Status:
                            <Chip
                              size="small"
                              label={
                                selectedStreamer.musicthon?.config?.paused
                                  ? "paused"
                                  : selectedStreamer.musicthon?.config?.enabled
                                    ? "enabled"
                                    : "disabled"
                              }
                              color={
                                selectedStreamer.musicthon?.config?.paused
                                  ? "warning"
                                  : selectedStreamer.musicthon?.config?.enabled
                                    ? "success"
                                    : "default"
                              }
                              sx={{ ml: 1 }}
                            />
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper sx={{ ...sectionSurfaceSx, p: 1.2 }}>
                          <Typography variant="body2" mb={1}>
                            Ações operacionais
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Button
                              size="small"
                              variant="outlined"
                              color="warning"
                              disabled={
                                !!actionLoading ||
                                !selectedStreamer.musicthon?.config?.enabled ||
                                !!selectedStreamer.musicthon?.config?.paused
                              }
                              onClick={() => void updateMusicthonPaused(true)}
                            >
                              {actionLoading === "musicthon:pause"
                                ? "Pausando..."
                                : "Pausar musicthon"}
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              disabled={
                                !!actionLoading ||
                                !selectedStreamer.musicthon?.config?.enabled ||
                                !selectedStreamer.musicthon?.config?.paused
                              }
                              onClick={() => void updateMusicthonPaused(false)}
                            >
                              {actionLoading === "musicthon:resume"
                                ? "Retomando..."
                                : "Retomar musicthon"}
                            </Button>
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>
                  )}

                  {tab === "widgets" && (
                    <Stack spacing={1.25}>
                      <Paper sx={{ ...sectionSurfaceSx, p: 1.2 }}>
                        <Stack
                          direction={{ xs: "column", md: "row" }}
                          spacing={1}
                          alignItems={{ xs: "stretch", md: "center" }}
                        >
                          <TextField
                            size="small"
                            label="Overlay base URL (opcional)"
                            value={overlayBaseUrl}
                            onChange={(event) => setOverlayBaseUrl(event.target.value)}
                            placeholder="https://overlay.seudominio.com"
                            fullWidth
                          />
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => void loadOverlayDetails(selectedStreamer.streamerId)}
                            startIcon={<RefreshIcon />}
                          >
                            Atualizar
                          </Button>
                        </Stack>
                      </Paper>

                      {overlayLoading && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CircularProgress size={18} />
                          <Typography variant="body2" color="text.secondary">
                            Carregando links dos widgets...
                          </Typography>
                        </Stack>
                      )}

                      {!overlayLoading && widgetLinks.length === 0 && (
                        <Paper sx={{ ...sectionSurfaceSx, p: 1.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            Nenhum widget com obsLink encontrado para esse streamer.
                          </Typography>
                        </Paper>
                      )}

                      {widgetLinks.map((widget) => {
                        const v2Absolute = buildAbsoluteUrl(
                          overlayBaseUrl,
                          widget.overlayPathV2,
                        );
                        const legacyAbsolute = buildAbsoluteUrl(
                          overlayBaseUrl,
                          widget.overlayPathLegacy,
                        );

                        return (
                          <Paper
                            key={`${widget.widgetInstanceId}:${widget.variant || "default"}`}
                            sx={{ ...sectionSurfaceSx, p: 1.2 }}
                          >
                            <Stack spacing={1}>
                              <Stack
                                direction={{ xs: "column", md: "row" }}
                                justifyContent="space-between"
                                spacing={1}
                              >
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Chip
                                    size="small"
                                    label={widget.widgetType}
                                    color="primary"
                                  />
                                  {widget.variant && (
                                    <Chip
                                      size="small"
                                      label={widget.variant}
                                      variant="outlined"
                                    />
                                  )}
                                  <Chip
                                    size="small"
                                    label={widget.enabled ? "enabled" : "disabled"}
                                    color={widget.enabled ? "success" : "default"}
                                  />
                                </Stack>
                                <Typography variant="caption" color="text.secondary">
                                  instance: {widget.widgetInstanceId}
                                </Typography>
                              </Stack>

                              <Typography variant="body2">
                                obsLink: <strong>{widget.obsLink || "-"}</strong>
                              </Typography>

                              <Typography variant="body2" color="text.secondary">
                                V2: {v2Absolute || "-"}
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<ContentCopyIcon />}
                                  disabled={!v2Absolute}
                                  onClick={() =>
                                    v2Absolute &&
                                    copyToClipboard(v2Absolute, "Link v2")
                                  }
                                >
                                  Copiar v2
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<OpenInNewIcon />}
                                  disabled={!widget.overlayPathV2}
                                  onClick={() => openOverlayPath(widget.overlayPathV2)}
                                >
                                  Abrir v2
                                </Button>
                              </Stack>

                              <Typography variant="body2" color="text.secondary">
                                Legado: {legacyAbsolute || "-"}
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<ContentCopyIcon />}
                                  disabled={!legacyAbsolute}
                                  onClick={() =>
                                    legacyAbsolute &&
                                    copyToClipboard(legacyAbsolute, "Link legado")
                                  }
                                >
                                  Copiar legado
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<OpenInNewIcon />}
                                  disabled={!widget.overlayPathLegacy}
                                  onClick={() => openOverlayPath(widget.overlayPathLegacy)}
                                >
                                  Abrir legado
                                </Button>
                              </Stack>
                            </Stack>
                          </Paper>
                        );
                      })}
                    </Stack>
                  )}

                  {tab === "displays" && (
                    <Stack spacing={1.25}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => void loadOverlayDetails(selectedStreamer.streamerId)}
                          startIcon={<RefreshIcon />}
                        >
                          Atualizar displays
                        </Button>
                        {primaryDisplayId && (
                          <Chip
                            size="small"
                            color="success"
                            label={`Primary: ${primaryDisplayId}`}
                          />
                        )}
                      </Stack>

                      {!overlayLoading && overlayDisplays.length === 0 && (
                        <Paper sx={{ ...sectionSurfaceSx, p: 1.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            Nenhum display conectado no momento.
                          </Typography>
                        </Paper>
                      )}

                      {overlayDisplays.map((display) => (
                        <Paper key={display.displayId} sx={{ ...sectionSurfaceSx, p: 1.2 }}>
                          <Stack spacing={1}>
                            <Stack
                              direction={{ xs: "column", md: "row" }}
                              justifyContent="space-between"
                              spacing={1}
                            >
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Chip
                                  size="small"
                                  color={display.connected ? "success" : "default"}
                                  label={display.connected ? "connected" : "offline"}
                                />
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  label={display.role}
                                />
                                <Typography variant="body2" fontWeight={600}>
                                  {display.deviceLabel || display.displayId}
                                </Typography>
                              </Stack>
                              <Typography variant="caption" color="text.secondary">
                                {display.displayId}
                              </Typography>
                            </Stack>

                            <Typography variant="body2" color="text.secondary">
                              widget: {display.widgetType || "-"} | room: {display.room || "-"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              platform: {display.platform || "-"} | sockets: {display.connectedSockets}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              heartbeat: {toIsoDateTime(display.lastHeartbeatAt)} | seen:{" "}
                              {toIsoDateTime(display.lastSeenAt)}
                            </Typography>

                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Button
                                size="small"
                                variant="outlined"
                                disabled={
                                  !display.connected ||
                                  !display.widgetInstanceId ||
                                  !supportsPrimarySelection(display.widgetType) ||
                                  primaryDisplayId === display.displayId ||
                                  selectingPrimaryDisplayId === display.displayId
                                }
                                onClick={() => void setPrimaryDisplay(display)}
                              >
                                {primaryDisplayId === display.displayId
                                  ? "PRIMARY atual"
                                  : selectingPrimaryDisplayId === display.displayId
                                    ? "Atualizando..."
                                    : "Definir PRIMARY"}
                              </Button>
                              {!supportsPrimarySelection(display.widgetType) && (
                                <Chip
                                  size="small"
                                  variant="outlined"
                                  label="Primary apenas donation/store"
                                />
                              )}
                            </Stack>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  )}

                  {tab === "logs" && (
                    <Paper sx={{ ...sectionSurfaceSx, p: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Próxima etapa recomendada: timeline unificada de eventos (alert + musicthon + display)
                        por streamer.
                      </Typography>
                      <Typography variant="body2" mt={1}>
                        Última atualização alertas:{" "}
                        <strong>{toIsoDateTime(selectedStreamer.alerts?.state?.updatedAt)}</strong>
                      </Typography>
                      <Typography variant="body2" mt={1}>
                        Última atualização musicthon:{" "}
                        <strong>
                          {toIsoDateTime(selectedStreamer.musicthon?.config?.updatedAt)}
                        </strong>
                      </Typography>
                    </Paper>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const MetricCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => {
  return (
    <Paper
      sx={{
        p: 1.35,
        borderRadius: 2,
        bgcolor: "rgba(8, 13, 24, 0.82)",
        border: `1px solid ${color}55`,
        boxShadow:
          "0 12px 24px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255,255,255,0.03)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `linear-gradient(130deg, ${color}18 0%, transparent 55%)`,
          pointerEvents: "none",
        },
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ letterSpacing: "0.04em", textTransform: "uppercase" }}
      >
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.1 }}>
        {value}
      </Typography>
    </Paper>
  );
};

export default QueueControlCenterPage;
