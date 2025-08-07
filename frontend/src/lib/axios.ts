import axios from "axios";

const API_BASE_URL = "http://localhost:8765";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    // Do not attach token for login or register endpoints
    if (!config.url?.includes("USER-SERVICE/user/login") && !config.url?.includes("USER-SERVICE/user/register")) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;