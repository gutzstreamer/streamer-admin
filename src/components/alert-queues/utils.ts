export const buildHeaders = () => {
  const headers = new Headers({ Accept: "application/json" });
  const token = localStorage.getItem("token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};
