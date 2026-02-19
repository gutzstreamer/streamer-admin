import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DevicesIcon from "@mui/icons-material/Devices";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import { useMemo, useState } from "react";

export type OverlayDisplayInfo = {
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
  lastSeenAt: string;
  connectedSockets: number;
};

type OverlayDisplaysCardProps = {
  displays: OverlayDisplayInfo[];
  primaryDisplayId: string | null;
  loading: boolean;
  selectingDisplayId: string | null;
  onSelectPrimary: (display: OverlayDisplayInfo) => void;
};

const ACK_WIDGET_TYPES = new Set(["donation", "store"]);
type WidgetFilter = "all" | "donation" | "store";
const PANEL_SX = {
  bgcolor: "rgba(11, 16, 28, 0.78)",
  border: "1px solid rgba(118, 153, 220, 0.28)",
  borderRadius: 2.5,
  boxShadow:
    "0 18px 40px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)",
};

const SURFACE_SX = {
  bgcolor: "rgba(8, 13, 24, 0.82)",
  border: "1px solid rgba(128, 159, 221, 0.24)",
  borderRadius: 1.5,
  boxShadow:
    "0 10px 24px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.03)",
};

const formatDateTime = (value?: string | null): string => {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString();
};

const shortId = (value: string): string => {
  if (value.length <= 12) {
    return value;
  }

  return `${value.slice(0, 12)}...`;
};

const OverlayDisplaysCard = ({
  displays,
  primaryDisplayId,
  loading,
  selectingDisplayId,
  onSelectPrimary,
}: OverlayDisplaysCardProps) => {
  const [widgetFilter, setWidgetFilter] = useState<WidgetFilter>("all");
  const [confirmingDisplay, setConfirmingDisplay] = useState<OverlayDisplayInfo | null>(null);

  const filteredDisplays = useMemo(() => {
    if (widgetFilter === "all") {
      return displays;
    }

    return displays.filter(
      (display) => (display.widgetType ?? "").toLowerCase() === widgetFilter,
    );
  }, [displays, widgetFilter]);

  const isConfirmingSelection =
    confirmingDisplay !== null && selectingDisplayId === confirmingDisplay.displayId;

  const handleCloseConfirm = () => {
    if (isConfirmingSelection) {
      return;
    }

    setConfirmingDisplay(null);
  };

  const handleConfirmPrimary = () => {
    if (!confirmingDisplay || isConfirmingSelection) {
      return;
    }

    onSelectPrimary(confirmingDisplay);
    setConfirmingDisplay(null);
  };

  return (
    <Card elevation={1} sx={{ ...PANEL_SX, mb: 1.5 }}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <DevicesIcon sx={{ color: "info.main" }} />
            <Typography variant="body1" fontWeight="bold" fontSize="0.95rem">
              Displays do Overlay
            </Typography>
            {loading && <CircularProgress size={14} />}
          </Stack>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            Controle do PRIMARY/MIRROR para ACK de donation/store.
          </Typography>
        }
        sx={{ pb: 0.5 }}
      />

      <CardContent sx={{ pt: 0.5 }}>
        <Stack direction="row" spacing={0.75} mb={1.25}>
          <Chip
            size="small"
            label="Todos"
            onClick={() => setWidgetFilter("all")}
            color={widgetFilter === "all" ? "primary" : "default"}
            sx={{ fontSize: "0.68rem", height: 22 }}
          />
          <Chip
            size="small"
            label="Donation"
            onClick={() => setWidgetFilter("donation")}
            color={widgetFilter === "donation" ? "primary" : "default"}
            sx={{ fontSize: "0.68rem", height: 22 }}
          />
          <Chip
            size="small"
            label="Store"
            onClick={() => setWidgetFilter("store")}
            color={widgetFilter === "store" ? "primary" : "default"}
            sx={{ fontSize: "0.68rem", height: 22 }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Chip
            size="small"
            label={`${filteredDisplays.length} display(s)`}
            sx={{ fontSize: "0.68rem", height: 22 }}
          />
        </Stack>

        {displays.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              ...SURFACE_SX,
              p: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
              Nenhum display conectado ou visto recentemente para este streamer.
            </Typography>
          </Paper>
        ) : filteredDisplays.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              ...SURFACE_SX,
              p: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
              Nenhum display para o filtro selecionado.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={1}>
            {filteredDisplays.map((display) => {
              const isPrimary = primaryDisplayId
                ? display.displayId === primaryDisplayId
                : display.role === "primary";
              const widgetType = (display.widgetType ?? "").toLowerCase();
              const canSelectPrimary =
                display.connected &&
                display.widgetInstanceId !== null &&
                ACK_WIDGET_TYPES.has(widgetType);

              return (
                <Grid item xs={12} md={6} key={display.displayId}>
                  <Paper
                    elevation={0}
                    sx={{
                      ...SURFACE_SX,
                      p: 1.25,
                      border: isPrimary
                        ? "1px solid rgba(76, 175, 80, 0.45)"
                        : "1px solid rgba(128, 159, 221, 0.24)",
                    }}
                  >
                    <Stack spacing={0.75}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <MonitorHeartIcon
                            fontSize="small"
                            color={display.active ? "success" : "disabled"}
                          />
                          <Typography variant="body2" fontWeight={700} fontSize="0.78rem">
                            {display.deviceLabel || "Display sem nome"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={0.5}>
                          <Chip
                            size="small"
                            label={isPrimary ? "PRIMARY" : "MIRROR"}
                            color={isPrimary ? "success" : "default"}
                            sx={{ height: 20, fontSize: "0.68rem", fontWeight: 700 }}
                          />
                          <Chip
                            size="small"
                            label={display.connected ? "Conectado" : "Desconectado"}
                            color={display.connected ? "success" : "default"}
                            sx={{ height: 20, fontSize: "0.68rem" }}
                          />
                        </Stack>
                      </Stack>

                      <Stack spacing={0.35}>
                        <Typography variant="caption" fontSize="0.68rem" color="text.secondary">
                          Display: <Box component="span" sx={{ fontFamily: "monospace", color: "text.primary" }}>{shortId(display.displayId)}</Box>
                        </Typography>
                        <Typography variant="caption" fontSize="0.68rem" color="text.secondary">
                          Plataforma: <Box component="span" sx={{ color: "text.primary" }}>{display.platform || "-"}</Box>
                          {display.clientVersion ? ` (v${display.clientVersion})` : ""}
                        </Typography>
                        <Typography variant="caption" fontSize="0.68rem" color="text.secondary">
                          Widget: <Box component="span" sx={{ color: "text.primary" }}>{display.widgetType || "-"}</Box>
                          {display.widgetInstanceId
                            ? ` (${shortId(display.widgetInstanceId)})`
                            : ""}
                        </Typography>
                        <Typography variant="caption" fontSize="0.68rem" color="text.secondary">
                          Heartbeat: <Box component="span" sx={{ color: "text.primary" }}>{formatDateTime(display.lastHeartbeatAt)}</Box>
                        </Typography>
                        <Typography variant="caption" fontSize="0.68rem" color="text.secondary">
                          Última atividade: <Box component="span" sx={{ color: "text.primary" }}>{formatDateTime(display.lastSeenAt)}</Box>
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="flex-end">
                        {isPrimary ? (
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            disabled
                            sx={{ textTransform: "none", fontSize: "0.72rem" }}
                          >
                            Display principal
                          </Button>
                        ) : (
                          <Tooltip
                            title={
                              canSelectPrimary
                                ? "Define este display como PRIMARY"
                                : "Apenas displays conectados de donation/store podem virar PRIMARY"
                            }
                          >
                            <span>
                              <Button
                                variant="outlined"
                                size="small"
                                color="info"
                                disabled={!canSelectPrimary || selectingDisplayId === display.displayId}
                                onClick={() => setConfirmingDisplay(display)}
                                sx={{ textTransform: "none", fontSize: "0.72rem" }}
                              >
                                {selectingDisplayId === display.displayId
                                  ? "Definindo..."
                                  : "Tornar principal"}
                              </Button>
                            </span>
                          </Tooltip>
                        )}
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </CardContent>

      <Dialog
        open={confirmingDisplay !== null}
        onClose={handleCloseConfirm}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: "1rem", pb: 1 }}>
          Confirmar troca de display principal
        </DialogTitle>
        <DialogContent sx={{ pt: "8px !important" }}>
          <Typography variant="body2" mb={1}>
            Você vai definir o display abaixo como <strong>PRIMARY</strong> para ACK de fila.
          </Typography>
          {confirmingDisplay && (
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Dispositivo:{" "}
                <Box component="span" sx={{ color: "text.primary" }}>
                  {confirmingDisplay.deviceLabel || "Display sem nome"}
                </Box>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Widget:{" "}
                <Box component="span" sx={{ color: "text.primary" }}>
                  {confirmingDisplay.widgetType || "-"}
                </Box>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Display ID:{" "}
                <Box component="span" sx={{ fontFamily: "monospace", color: "text.primary" }}>
                  {shortId(confirmingDisplay.displayId)}
                </Box>
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseConfirm} disabled={isConfirmingSelection}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmPrimary}
            variant="contained"
            color="info"
            disabled={isConfirmingSelection}
          >
            {isConfirmingSelection ? "Definindo..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default OverlayDisplaysCard;
