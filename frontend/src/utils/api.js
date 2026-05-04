import axios from "axios";

const normalizeUrl = (url) => (url || "").trim().replace(/\/+$/, "");

const getApiBaseUrl = () => {
  const envUrl = normalizeUrl(process.env.REACT_APP_API_URL);
  if (envUrl) return envUrl;
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000";
  }
  if (typeof window !== "undefined") {
    return normalizeUrl(window.location.origin);
  }
  return "";
};

export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export default api;
