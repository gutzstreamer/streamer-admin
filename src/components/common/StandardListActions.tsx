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
  filters?: React.ReactNode;
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

    if (Array.isArray(props.filters) && props.filters.length > 0) {
      return <FilterButton label="Filtros avancados" />;
    }

    if (filtersFromContext && React.isValidElement(filtersFromContext)) {
      return React.cloneElement(filtersFromContext, {
        resource,
        showFilter,
        displayedFilters,
        filterValues,
        context: "button",
      });
    }

    if (Array.isArray(filtersFromContext) && filtersFromContext.length > 0) {
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
