import React from "react";
import {
  CreateButton,
  FilterButton,
  FilterContext,
  TopToolbar,
  useListContext,
  useResourceContext,
  useResourceDefinition,
} from "react-admin";
import { AsyncCsvExportButton } from "./AsyncCsvExportButton";
import { ListViewsControl } from "./ListViewsControl";

interface StandardListActionsProps {
  filters?: React.ReactElement;
  resource?: string;
}

export const StandardListActions: React.FC<StandardListActionsProps> = (
  props,
) => {
  const { displayedFilters, filterValues, showFilter } = useListContext();
  const { hasCreate } = useResourceDefinition();
  const resource = useResourceContext(props);
  const filtersFromContext = React.useContext(FilterContext);

  const renderedFilterControl = React.useMemo(() => {
    if (props.filters && React.isValidElement(props.filters)) {
      return React.cloneElement(props.filters, {
        resource,
        showFilter,
        displayedFilters,
        filterValues,
        context: "button",
      });
    }

    if (filtersFromContext) {
      return <FilterButton label="Filtros avancados" />;
    }

    return null;
  }, [
    props.filters,
    resource,
    showFilter,
    displayedFilters,
    filterValues,
    filtersFromContext,
  ]);

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
        {renderedFilterControl}
        <ListViewsControl />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <AsyncCsvExportButton />
        {hasCreate ? <CreateButton /> : null}
      </div>
    </TopToolbar>
  );
};
