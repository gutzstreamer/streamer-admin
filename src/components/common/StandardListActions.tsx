import React from "react";
import {
  CreateButton,
  FilterButton,
  TopToolbar,
  useResourceDefinition,
} from "react-admin";
import { AsyncCsvExportButton } from "./AsyncCsvExportButton";
import { ListViewsControl } from "./ListViewsControl";

interface StandardListActionsProps {
  filters?: React.ReactNode[] | React.ReactNode;
}

export const StandardListActions: React.FC<StandardListActionsProps> = (
  props,
) => {
  const { hasCreate } = useResourceDefinition();
  const hasFilters = Array.isArray(props.filters)
    ? props.filters.length > 0
    : Boolean(props.filters);

  return (
    <TopToolbar
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        px: 1,
        py: 0.5,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {hasFilters ? (
          <FilterButton label="Filtros avançados" filters={props.filters} />
        ) : null}
        <ListViewsControl />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <AsyncCsvExportButton />
        {hasCreate ? <CreateButton /> : null}
      </div>
    </TopToolbar>
  );
};
