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

  renewYouTubeWebhooks: () => Promise<any>;

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

const streamerDataProvider: DataProviderWithCustomMethods = {
  ...dataProvider,

  getList: (resource, params) => {
    const { filter, pagination, sort } = params;

    // 🔥 Limpa filtros vazios ou nulos
    const cleanFilter = Object.fromEntries(
      Object.entries(filter).filter(([_, v]) => v !== undefined && v !== ""),
    );

    // Lógica padrão para todos os resources
    const query: Record<string, any> = {
      ...cleanFilter,
      page: pagination?.page ?? 1,
      pageSize: pagination?.perPage ?? 10,
      sortField: sort?.field,
      sortOrder: sort?.order,
    };

    // Conversão de reais -> centavos para tier-config
    if (resource === "tier-config" && query.minPriceReais) {
      query.minPriceCents = Math.round(Number(query.minPriceReais) * 100);
      delete query.minPriceReais;
    }

    const queryString = new URLSearchParams(query as any).toString();

    const hasFilter = Object.keys(cleanFilter).length > 0;

    // 🦏 Alguns recursos não têm endpoint /all, sempre usam o endpoint raiz
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
