import { AuthProvider, HttpError, fetchUtils } from "react-admin";

const BASE_URL = import.meta.env.VITE_SIMPLE_REST_URL;

const accessToken = localStorage.getItem("token");

export const authProvider: AuthProvider = {
  login: async ({ username, password, captchaToken }) => {
    try {
      const responseToken = await fetchUtils.fetchJson(
        BASE_URL + "/authorization/login",
        {
          method: "POST",
          body: JSON.stringify({ email: username, password }),
          headers: new Headers({
            "x-turnstile-token": captchaToken
          })
        },
      );
      const { accessToken } = responseToken.json;

      // Decodifica o token JWT para extrair os dados do usuário
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const roles = payload["roles"] || [];
      const userId = payload["sub"] || payload["id"];
      const nickname = payload["nickname"] || username;
      const image = payload["image"] || undefined;

      if (!roles.includes("admin")) {
        throw new HttpError("Unauthorized", 401, {
          message: "Invalid username or password",
        });
      }

      const user = {
        password,
        id: userId,
        username: nickname,
        fullName: "Admin",
        avatar: image,
      };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", accessToken);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(
        new HttpError("Unauthorized", 401, {
          message: "Invalid username or password",
        }),
      );
    }
  },
  logout: async () => {
    const token = localStorage.getItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    if (!token) {
      return Promise.resolve();
    }
    const logout = await fetchUtils.fetchJson(
      BASE_URL + "/authorization/logout",
      {
        method: "POST",
        headers: new Headers({ Authorization: `Bearer ${token}` }),
      },
    );
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    localStorage.getItem("user") ? Promise.resolve() : Promise.reject(),
  getPermissions: () => {
    return Promise.resolve(undefined);
  },
  getIdentity: () => {
    const persistedUser = localStorage.getItem("user");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    return Promise.resolve(user);
  },
};

export default authProvider;
