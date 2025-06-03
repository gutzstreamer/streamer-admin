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
    let url = `${apiUrl}/${resource}/all`;
    return httpClient(url).then(({ headers, json }) => {
      if (resource === "wallet-transactions") {
        return {
          data: json.content,
          total: json.pagination.total,
        };
      }
      return {
        data: json,
        total: json.length ?? 0,
      };
    });
  },
  retry: function (
    resource: string,
    params: {
      id: string;
    },
    type: "invoice" | "factory" = "invoice",
  ): Promise<any> {
    return httpClient(`${apiUrl}/${resource}/${params.id}/retry/${type}`, {
      method: "POST",
    });
  },
};

export default streamerDataProvider;
