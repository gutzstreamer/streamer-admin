import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { SortPayload, useGetIdentity, useListContext, useNotify } from "react-admin";

interface SavedView {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  sort: SortPayload;
  perPage: number;
}

const getStorageKey = (resource: string, identityId?: string) =>
  `streamer-admin:list-views:${identityId ?? "anonymous"}:${resource}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseSavedViews = (value: string | null): SavedView[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is SavedView => {
        if (!isRecord(item)) return false;
        return (
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          isRecord(item.filters) &&
          isRecord(item.sort) &&
          typeof item.perPage === "number"
        );
      })
      .map((item) => ({
        id: item.id,
        name: item.name,
        filters: item.filters,
        sort: {
          field:
            typeof item.sort.field === "string" ? item.sort.field : "id",
          order: item.sort.order === "ASC" ? "ASC" : "DESC",
        },
        perPage: Number.isFinite(item.perPage) ? item.perPage : 25,
      }));
  } catch {
    return [];
  }
};

export const ListViewsControl: React.FC = () => {
  const { identity } = useGetIdentity();
  const {
    resource,
    filterValues,
    sort,
    perPage,
    setFilters,
    setSort,
    setPerPage,
  } = useListContext();
  const notify = useNotify();

  const storageKey = React.useMemo(
    () => getStorageKey(resource, identity?.id ? String(identity.id) : undefined),
    [identity?.id, resource],
  );

  const [views, setViews] = React.useState<SavedView[]>([]);
  const [selectedId, setSelectedId] = React.useState("");

  React.useEffect(() => {
    setViews(parseSavedViews(localStorage.getItem(storageKey)));
    setSelectedId("");
  }, [storageKey]);

  const persistViews = (nextViews: SavedView[]) => {
    localStorage.setItem(storageKey, JSON.stringify(nextViews));
    setViews(nextViews);
  };

  const handleApplyView = (viewId: string) => {
    setSelectedId(viewId);
    const view = views.find((item) => item.id === viewId);
    if (!view) return;

    setFilters(view.filters, {});
    setSort(view.sort);
    setPerPage(view.perPage);
    notify(`Visão aplicada: ${view.name}`, { type: "info" });
  };

  const handleSaveCurrentView = () => {
    const enteredName = window.prompt("Nome da visão:");
    const name = enteredName?.trim();
    if (!name) return;

    const existing = views.find((view) => view.name.toLowerCase() === name.toLowerCase());
    const id = existing?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const nextView: SavedView = {
      id,
      name,
      filters: filterValues,
      sort,
      perPage,
    };

    const nextViews = existing
      ? views.map((view) => (view.id === id ? nextView : view))
      : [...views, nextView];

    persistViews(nextViews);
    setSelectedId(id);
    notify(`Visão salva: ${name}`, { type: "success" });
  };

  const handleDeleteView = () => {
    if (!selectedId) return;

    const target = views.find((view) => view.id === selectedId);
    if (!target) return;

    const confirmed = window.confirm(`Remover visão "${target.name}"?`);
    if (!confirmed) return;

    const nextViews = views.filter((view) => view.id !== selectedId);
    persistViews(nextViews);
    setSelectedId("");
    notify(`Visão removida: ${target.name}`, { type: "info" });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 170 }}>
        <InputLabel id="saved-views-label">Minhas visões</InputLabel>
        <Select
          labelId="saved-views-label"
          value={selectedId}
          label="Minhas visões"
          onChange={(event) => handleApplyView(String(event.target.value))}
        >
          <MenuItem value="">
            <em>Selecionar</em>
          </MenuItem>
          {views.map((view) => (
            <MenuItem key={view.id} value={view.id}>
              {view.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Tooltip title="Salvar visão atual">
        <IconButton size="small" onClick={handleSaveCurrentView}>
          <SaveOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Remover visão selecionada">
        <span>
          <IconButton size="small" onClick={handleDeleteView} disabled={!selectedId}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};
