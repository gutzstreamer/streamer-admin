import React from "react";
import DownloadIcon from "@mui/icons-material/Download";
import { Button } from "@mui/material";
import {
  useDataProvider,
  useListContext,
  useNotify,
  useResourceContext,
} from "react-admin";

const EXPORT_PAGE_SIZE = 1000;
const EXPORT_MAX_ROWS = 100000;

const csvEscape = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  const normalized =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  const escaped = normalized.replace(/"/g, '""');
  return `"${escaped}"`;
};

const downloadCsv = (filename: string, csvContent: string): void => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const AsyncCsvExportButton: React.FC = () => {
  const resource = useResourceContext();
  const { filterValues, sort } = useListContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    if (!resource || isExporting) return;

    setIsExporting(true);
    try {
      let page = 1;
      let total = 0;
      const rows: Record<string, unknown>[] = [];

      notify("Iniciando exportação...", { type: "info" });

      while (true) {
        const response = await dataProvider.getList(resource, {
          pagination: { page, perPage: EXPORT_PAGE_SIZE },
          sort,
          filter: filterValues,
        });

        if (page === 1) {
          total = response.total ?? response.data.length;
        }

        rows.push(...response.data);

        notify(`Exportando ${rows.length}${total ? ` de ${total}` : ""}...`, {
          type: "info",
        });

        if (
          response.data.length === 0 ||
          rows.length >= total ||
          rows.length >= EXPORT_MAX_ROWS
        ) {
          break;
        }

        page += 1;
      }

      if (rows.length === 0) {
        notify("Nenhum registro para exportar com os filtros atuais.", {
          type: "warning",
        });
        return;
      }

      if (rows.length >= EXPORT_MAX_ROWS) {
        notify(
          `Exportação limitada a ${EXPORT_MAX_ROWS} linhas para evitar travamento.`,
          { type: "warning" },
        );
      }

      const headers = Array.from(
        rows.reduce((acc, row) => {
          Object.keys(row).forEach((key) => acc.add(key));
          return acc;
        }, new Set<string>()),
      );

      const csvLines = [
        headers.map(csvEscape).join(","),
        ...rows.map((row) =>
          headers.map((header) => csvEscape(row[header])).join(","),
        ),
      ];

      const now = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      downloadCsv(`${resource}_${now}.csv`, csvLines.join("\n"));
      notify(`Exportação concluída: ${rows.length} linhas.`, {
        type: "success",
      });
    } catch (error) {
      notify(`Falha ao exportar CSV: ${String(error)}`, { type: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      size="small"
      startIcon={<DownloadIcon />}
      disabled={isExporting}
    >
      {isExporting ? "Exportando..." : "Exportar CSV"}
    </Button>
  );
};
