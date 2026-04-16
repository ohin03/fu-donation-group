import axios from "axios";

const normalizeUrl = (url) => (url || "").trim().replace(/\/+$/, "");

const getApiBaseUrl = () => {
  const envUrl = normalizeUrl(process.env.REACT_APP_API_URL);
  if (envUrl) return envUrl;
  return "http://localhost:5000";
};

export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export default api;
