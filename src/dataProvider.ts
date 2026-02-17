import { fetchUtils, DataProvider } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL;

export interface DataProviderWithCustomMethods extends DataProvider {
  retry: (
    resource: string,
    params: {
      id: string;
    },
    type?: "invoice" | "factory",
  ) => Promise<any>;

  checks: (
    resource: string,
    params: {
      id: string;
    },
    type?: "invoice" | "factory",
  ) => Promise<any>;

  cancelDonation: (
    donationId: string,
    reason: string,
  ) => Promise<any>;

  simulateMonthlyInvoice: (
    year: number,
    month: number,
    streamerId: string,
  ) => Promise<any>;

  createMonthlyInvoice: (
    year: number,
    month: number,
    streamerId: string,
  ) => Promise<any>;
}

const getToken = () => {
  return localStorage.getItem("token");
};

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const token = getToken();
  if (token) {
    (options.headers as Headers).set("Authorization", `Bearer ${token}`);
  }
  return fetchUtils.fetchJson(url, options);
};

export const dataProvider = simpleRestProvider(apiUrl, httpClient);

const widgetTemplateTypes = new Set([
  "donation",
  "goal",
  "rhynothon",
  "musicthon",
  "qrcode",
  "store",
]);

const parseWidgetTemplateId = (
  value?: string,
): { type?: string; templateId?: string } => {
  if (!value) return {};
  const parts = value.split(":");
  if (parts.length === 2) {
    return { type: parts[0], templateId: parts[1] };
  }
  return { templateId: value };
};

const normalizeBooleanFilter = (value: unknown): boolean | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

type DatePresetValue = "today" | "7d" | "30d";

const datePresetFieldByResource: Record<string, string> = {
  "chat-mentions": "capturedAt",
  "feature-toggles": "updatedAt",
  invoices: "issuedOn",
  sessions: "lastActivity",
  wallets: "updatedAt",
};

const formatDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildDatePresetRange = (
  preset: DatePresetValue,
): { gte: string; lte: string } => {
  const end = new Date();
  const start = new Date(end);

  if (preset === "7d") {
    start.setDate(end.getDate() - 6);
  } else if (preset === "30d") {
    start.setDate(end.getDate() - 29);
  }

  return {
    gte: formatDateInputValue(start),
    lte: formatDateInputValue(end),
  };
};

const streamerDataProvider: DataProviderWithCustomMethods = {
  ...dataProvider,

  getList: (resource, params) => {
    const { filter, pagination, sort } = params;

    if (resource === "widget-templates") {
      const type = (filter?.type as string | undefined) ?? "donation";
      if (!widgetTemplateTypes.has(type)) {
        console.warn("[widget-templates] Missing or invalid type filter", {
          type,
          filter,
          pagination,
        });
        return Promise.resolve({ data: [], total: 0 });
      }

      const query: Record<string, any> = {
        page: pagination?.page ?? 1,
        pageSize: pagination?.perPage ?? 10,
        default: normalizeBooleanFilter(filter?.default),
        subscriptionPlanId: filter?.subscriptionPlanId,
        streamerId: filter?.streamerId,
        enabled: normalizeBooleanFilter(filter?.enabled),
      };

      const cleanQuery = Object.fromEntries(
        Object.entries(query).filter(([_, v]) => v !== undefined && v !== ""),
      );

      const queryString = new URLSearchParams(cleanQuery as any).toString();
      const url = `${apiUrl}/admin/widgets/${type}/templates?${queryString}`;

      console.debug("[widget-templates] getList", {
        url,
        type,
        query: cleanQuery,
      });

      return httpClient(url).then(({ json }) => {
        const data = json.data ? json.data : json;
        const total =
          json.pagination?.total ??
          json.total ??
          (Array.isArray(data) ? data.length : 0);

        const mapped = Array.isArray(data)
          ? data.map((item: any) => ({
              ...item,
              id: `${type}:${item.id}`,
              templateId: item.id,
              type,
            }))
          : [];

        return { data: mapped, total };
      });
    }

    // ðŸ”¥ Limpa filtros vazios ou nulos
    const rawFilter = { ...(filter ?? {}) } as Record<string, any>;
    const datePreset = rawFilter.datePreset as DatePresetValue | undefined;
    if (datePreset) {
      const fieldBase = datePresetFieldByResource[resource] || "createdAt";
      const { gte, lte } = buildDatePresetRange(datePreset);
      rawFilter[`${fieldBase}_gte`] = gte;
      rawFilter[`${fieldBase}_lte`] = lte;
    }
    delete rawFilter.datePreset;

    const cleanFilter = Object.fromEntries(
      Object.entries(rawFilter).filter(([_, v]) => v !== undefined && v !== ""),
    );

    // LÃ³gica padrÃ£o para todos os resources
    const query: Record<string, any> = {
      ...cleanFilter,
      page: pagination?.page ?? 1,
      pageSize: pagination?.perPage ?? 10,
      sortField: sort?.field,
      sortOrder: sort?.order,
    };

    // ConversÃ£o de reais -> centavos para tier-config
    if (resource === "tier-config" && query.minPriceReais) {
      query.minPriceCents = Math.round(Number(query.minPriceReais) * 100);
      delete query.minPriceReais;
    }

    const queryString = new URLSearchParams(query as any).toString();

    const hasFilter = Object.keys(cleanFilter).length > 0;

    // ðŸ¦ Alguns recursos nÃ£o tÃªm endpoint /all, sempre usam o endpoint raiz
    const noAllEndpoint = ['refer', 'platform-benefits', 'chat-mentions'];
    const useAllEndpoint = !noAllEndpoint.includes(resource) && !hasFilter;
    
    const url = `${apiUrl}/${resource}${useAllEndpoint ? "/all" : ""}?${queryString}`;

    return httpClient(url).then(({ json }) => {
      const data = json.data ? json.data : json;
      const total = json.pagination?.total ?? json.total ?? (Array.isArray(data) ? data.length : 0);
      
      return {
        data,
        total,
      };
    });
  },

  update: (resource, params) => {
    if (resource === "widget-templates") {
      const { type: idType, templateId } = parseWidgetTemplateId(params.id as string);
      const dataType = (params.data as any)?.type as string | undefined;
      const type = dataType || idType;

      if (!type || !widgetTemplateTypes.has(type)) {
        return Promise.reject(new Error("Template type is required"));
      }

      const cleaned = { ...params.data } as any;
      delete cleaned.type;
      delete cleaned.templateId;
      delete cleaned.id;

      const id = templateId || (params.data as any)?.templateId || params.id;
      const url = `${apiUrl}/admin/widgets/${type}/templates/${id}`;
      return httpClient(url, {
        method: "PUT",
        body: JSON.stringify(cleaned),
      }).then(({ json }) => ({
        data: {
          ...json,
          id: `${type}:${json.id}`,
          templateId: json.id,
          type,
        },
      }));
    }

    if (resource === "product-streamer") {
      return httpClient(`${apiUrl}/${resource}/${params.id}/status`, {
        method: "PATCH",
        body: JSON.stringify(params.data),
      }).then(({ json }) => {
        if (!json) {
          return { data: { id: params.id, ...params.data } };
        }
        return { data: { id: params.id, ...json } };
      });
    } else {
      const url = `${apiUrl}/${resource}/${params.id}`;
      return httpClient(url, {
        method: "PUT",
        body: JSON.stringify(params.data),
      }).then(({ json }) => {
        return { data: json };
      });
    }
  },

  create: (resource, params) => {
    if (resource === "widget-templates") {
      const type = (params.data as any)?.type as string | undefined;
      if (!type || !widgetTemplateTypes.has(type)) {
        return Promise.reject(new Error("Template type is required"));
      }

      const cleaned = { ...params.data } as any;
      delete cleaned.type;

      const url = `${apiUrl}/admin/widgets/${type}/templates`;
      return httpClient(url, {
        method: "POST",
        body: JSON.stringify(cleaned),
      }).then(({ json }) => ({
        data: {
          ...json,
          id: `${type}:${json.id}`,
          templateId: json.id,
          type,
        },
      }));
    }

    return dataProvider.create(resource, params);
  },

  getOne: (resource, params) => {
    if (resource === "widget-templates") {
      const { type: idType, templateId } = parseWidgetTemplateId(params.id as string);
      const type = (params.meta as any)?.type || idType;
      if (!type || !widgetTemplateTypes.has(type)) {
        return Promise.reject(new Error("Template type is required"));
      }

      const id = templateId || params.id;
      const url = `${apiUrl}/admin/widgets/${type}/templates/${id}`;
      return httpClient(url).then(({ json }) => ({
        data: {
          ...json,
          id: `${type}:${json.id}`,
          templateId: json.id,
          type,
        },
      }));
    }

    return dataProvider.getOne(resource, params);
  },

  delete: (resource, params) => {
    if (resource === "widget-templates") {
      const { type: idType, templateId } = parseWidgetTemplateId(params.id as string);
      const type = (params.meta as any)?.type || idType;
      if (!type || !widgetTemplateTypes.has(type)) {
        return Promise.reject(new Error("Template type is required"));
      }

      const id = templateId || params.id;
      const url = `${apiUrl}/admin/widgets/${type}/templates/${id}`;
      return httpClient(url, { method: "DELETE" }).then(({ json }) => ({
        data: {
          ...json,
          id: `${type}:${json.id}`,
          templateId: json.id,
          type,
        },
      }));
    }

    return dataProvider.delete(resource, params);
  },

  checks(
    resource: string,
    params: { id: string },
    type: "invoice" | "factory" = "invoice",
  ) {
    return httpClient(`${apiUrl}/${resource}/${params.id}/checks/${type}`, {
      method: "POST",
    });
  },

  retry(
    resource: string,
    params: { id: string },
    type: "invoice" | "factory" = "invoice",
  ) {
    return httpClient(`${apiUrl}/${resource}/${params.id}/retry/${type}`, {
      method: "POST",
    });
  },

  cancelDonation(donationId: string, reason: string) {
    return httpClient(`${apiUrl}/donations/cancel/${donationId}`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  simulateMonthlyInvoice(year: number, month: number, streamerId: string) {
    return httpClient(`${apiUrl}/monthly-service-invoices/simulate`, {
      method: "POST",
      body: JSON.stringify({ year, month, streamerId }),
    }).then(({ json }) => ({
      data: json.data || json,
    }));
  },

  createMonthlyInvoice(year: number, month: number, streamerId: string) {
    return httpClient(`${apiUrl}/monthly-service-invoices`, {
      method: "POST",
      body: JSON.stringify({ year, month, streamerId }),
    }).then(({ json }) => ({
      data: json.data || json,
    }));
  },
};

export default streamerDataProvider;

