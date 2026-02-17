import React from "react";
import {
  CreateButton,
  FilterButton,
  TopToolbar,
  useResourceDefinition,
} from "react-admin";
import { AsyncCsvExportButton } from "./AsyncCsvExportButton";
import { ListViewsControl } from "./ListViewsControl";

export const StandardListActions: React.FC = () => {
  const { hasCreate } = useResourceDefinition();

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
        <FilterButton label="Filtros avançados" />
        <ListViewsControl />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <AsyncCsvExportButton />
        {hasCreate ? <CreateButton /> : null}
      </div>
    </TopToolbar>
  );
};
