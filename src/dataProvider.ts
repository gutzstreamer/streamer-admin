import { fetchUtils, DataProvider } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

const apiUrl = import.meta.env.VITE_SIMPLE_REST_URL;

// Função para obter o token de autenticação (substitua pela sua lógica de obtenção do token)
const getToken = () => {
  return localStorage.getItem("token"); // Exemplo: obtendo o token do localStorage
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
    if (resource === "donations") {
      const { streamerId } = params.filter;
      url = `${apiUrl}/streamers/${streamerId}/donations`;
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
        total: json.length,
      };
    });
  },
  // Adicione outros métodos do dataProvider conforme necessário
};

export default streamerDataProvider;
