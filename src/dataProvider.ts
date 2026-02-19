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

const numericFilterPatterns = [
  /amount/i,
  /price/i,
  /fee/i,
  /rate/i,
  /percent/i,
  /count/i,
  /quantity/i,
  /total/i,
  /limit/i,
  /score/i,
  /cents/i,
  /days?/i,
  /months?/i,
  /years?/i,
];

const booleanFilterKeys = new Set([
  "active",
  "blocked",
  "default",
  "enabled",
  "isActive",
  "isDefault",
  "isEnabled",
  "isPublished",
  "paid",
  "public",
  "skipAlert",
  "verified",
]);

const normalizeFilterEntry = (
  key: string,
  value: unknown,
): unknown => {
  if (value === undefined || value === null || value === "") return undefined;

  if (typeof value === "string") {
    if (booleanFilterKeys.has(key)) {
      return normalizeBooleanFilter(value);
    }

    if (numericFilterPatterns.some((pattern) => pattern.test(key))) {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }
  }

  if (typeof value === "boolean" && booleanFilterKeys.has(key)) {
    return value;
  }

  return value;
};

const normalizeFilterValues = (
  filter: Record<string, unknown>,
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(filter)
      .map(([key, value]) => [key, normalizeFilterEntry(key, value)])
      .filter(([_, value]) => value !== undefined),
  );

const sanitizeQueryValues = (
  query: Record<string, unknown>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(query).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "",
    ),
  ) as Record<string, string | number | boolean>;

const resourcesWithoutAllEndpoint = new Set([
  "refer",
  "platform-benefits",
  "chat-mentions",
]);

const resourcesAlwaysUsingAllEndpoint = new Set(["users"]);

type SortPayload = {
  field?: string;
  order?: string;
};

const getNestedValue = (record: any, fieldPath: string) =>
  fieldPath.split(".").reduce((acc, key) => acc?.[key], record);

const compareValues = (left: unknown, right: unknown): number => {
  if (left === right) return 0;
  if (left === undefined || left === null) return -1;
  if (right === undefined || right === null) return 1;

  if (typeof left === "boolean" && typeof right === "boolean") {
    return Number(left) - Number(right);
  }

  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  const leftDate = Date.parse(String(left));
  const rightDate = Date.parse(String(right));
  if (!Number.isNaN(leftDate) && !Number.isNaN(rightDate)) {
    return leftDate - rightDate;
  }

  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const sortDataClientSide = (
  data: any[],
  sort?: SortPayload,
): any[] => {
  if (!Array.isArray(data) || !sort?.field || !sort?.order) return data;

  const direction = sort.order === "DESC" ? -1 : 1;
  const field = sort.field;

  return [...data].sort((left, right) => {
    const leftValue = getNestedValue(left, field);
    const rightValue = getNestedValue(right, field);
    return compareValues(leftValue, rightValue) * direction;
  });
};

const toFiniteNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const streamerDataProvider: DataProviderWithCustomMethods = {
  ...dataProvider,

  getList: async (resource, params) => {
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

    const cleanFilter = normalizeFilterValues(rawFilter);

    // Lógica padrão para todos os resources
    const rawQuery: Record<string, unknown> = {
      ...cleanFilter,
      page: pagination?.page ?? 1,
      pageSize: pagination?.perPage ?? 10,
      sortField: sort?.field,
      sortOrder: sort?.order,
    };

    // Conversão de reais -> centavos para tier-config
    if (resource === "tier-config" && rawQuery.minPriceReais) {
      rawQuery.minPriceCents = Math.round(Number(rawQuery.minPriceReais) * 100);
      delete rawQuery.minPriceReais;
    }

    const queryWithSort = sanitizeQueryValues(rawQuery);
    const queryWithoutSort = sanitizeQueryValues({
      ...rawQuery,
      sortField: undefined,
      sortOrder: undefined,
    });

    const hasFilter = Object.keys(cleanFilter).length > 0;
    const prefersAllEndpoint =
      resourcesAlwaysUsingAllEndpoint.has(resource) ||
      (!resourcesWithoutAllEndpoint.has(resource) && !hasFilter);

    const endpointCandidates = Array.from(
      new Set(
        prefersAllEndpoint
          ? [`${resource}/all`, resource]
          : [resource, `${resource}/all`],
      ),
    );

    const runListRequest = async (
      endpoint: string,
      query: Record<string, string | number | boolean>,
    ) => {
      const queryString = new URLSearchParams(query as any).toString();
      const url = `${apiUrl}/${endpoint}?${queryString}`;
      const { json } = await httpClient(url);
      const responseData = json.data ? json.data : json;
      const total =
        json.pagination?.total ??
        json.total ??
        (Array.isArray(responseData) ? responseData.length : 0);

      return {
        data: Array.isArray(responseData)
          ? sortDataClientSide(responseData, sort)
          : responseData,
        total,
      };
    };

    const shouldRetryWithoutSort =
      queryWithSort.sortField !== undefined || queryWithSort.sortOrder !== undefined;

    let lastError: unknown;

    for (const endpoint of endpointCandidates) {
      try {
        return await runListRequest(endpoint, queryWithSort);
      } catch (error) {
        lastError = error;
      }

      if (!shouldRetryWithoutSort) continue;

      try {
        return await runListRequest(endpoint, queryWithoutSort);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
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

    if (resource === "refer") {
      const currentData = (params.data ?? {}) as Record<string, unknown>;
      const previousData = (params.previousData ?? {}) as Record<string, unknown>;

      const payloadFromCurrent: Record<string, unknown> = {
        commissionPercent: toFiniteNumber(currentData.commissionPercent),
        durationMonths: toFiniteNumber(currentData.durationMonths),
        isActive:
          typeof currentData.isActive === "boolean"
            ? currentData.isActive
            : normalizeBooleanFilter(currentData.isActive),
      };

      let payload = sanitizeQueryValues(payloadFromCurrent);

      if (Object.keys(payload).length === 0) {
        const payloadFromPrevious: Record<string, unknown> = {
          commissionPercent: toFiniteNumber(previousData.commissionPercent),
          durationMonths: toFiniteNumber(previousData.durationMonths),
          isActive:
            typeof previousData.isActive === "boolean"
              ? previousData.isActive
              : normalizeBooleanFilter(previousData.isActive),
        };
        payload = sanitizeQueryValues(payloadFromPrevious);
      }

      if (Object.keys(payload).length === 0) {
        return Promise.resolve({
          data: params.previousData ?? { id: params.id },
        });
      }

      return httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }).then(({ json }) => ({
        data: json,
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

