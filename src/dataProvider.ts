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

    const query = {
      ...cleanFilter,
      page: pagination?.page ?? 1,
      pageSize: pagination?.perPage ?? 10,
      sortField: sort?.field,
      sortOrder: sort?.order,
    };

    const queryString = new URLSearchParams(query as any).toString();

    const hasFilter = Object.keys(cleanFilter).length > 0;
    const url = `${apiUrl}/${resource}${hasFilter ? "" : "/all"}?${queryString}`;

    return httpClient(url).then(({ headers, json }) => {
      return {
        data: json.data ? json.data : json,
        total: json.pagination?.total ?? json.total ?? 0,
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
          console.error("Resposta da API vazia");
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
};

export default streamerDataProvider;
