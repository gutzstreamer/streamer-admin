import { fetchUtils, DataProvider } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL;

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

const streamerDataProvider: DataProvider = {
  ...dataProvider,
  getList: (resource, params) => {
    let url = `${apiUrl}/${resource}`;

    const { filter, pagination, sort } = params;
    const { streamerId } = filter;

    if (resource === "donations") {
      if(streamerId) url = `${apiUrl}/donations?streamerId=${streamerId}`;
      else url = `${apiUrl}/donations`;
    }

    if (resource === "product-streamer") {
      if (streamerId) url = `${apiUrl}/product-streamer/streamer/${streamerId}`;
    }

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
};

export default streamerDataProvider;
