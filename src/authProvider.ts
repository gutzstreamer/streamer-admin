import { AuthProvider, HttpError, fetchUtils } from "react-admin";

const BASE_URL = import.meta.env.VITE_SIMPLE_REST_URL;

const accessToken = localStorage.getItem("token");

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      const responseToken = await fetchUtils.fetchJson(
        BASE_URL + "/authorization/login",
        {
          method: "POST",
          body: JSON.stringify({ email: username, password }),
        },
      );
      const { accessToken } = responseToken.json;

      const userResponse = await fetchUtils.fetchJson(
        BASE_URL + "/authorization/info",
        {
          method: "GET",
          headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
        },
      );

      const roles = userResponse.json["roles"];

      if (!roles.includes("admin")) {
        Promise.reject(
          new HttpError("Unauthorized", 401, {
            message: "Invalid username or password",
          }),
        );
      }

      const profileResponse = await fetchUtils.fetchJson(
        BASE_URL + `/profiles?userId=${userResponse.json.id}`,
        {
          method: "GET",
          headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
        },
      );

      const user = {
        password,
        id: userResponse.json.id,
        username: profileResponse.json.nickname,
        fullName: "Admin",
        avatar: profileResponse.json.image,
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
