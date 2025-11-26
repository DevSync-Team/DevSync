// utils/api.ts
import axios, { AxiosError } from "axios";
import config from "./config";

// Helper to read cookie value
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? match[2] : null;
}

// Create Axios instance
const api = axios.create({
  baseURL:
    config.backendURL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for sending cookies
});

// Attach access token from cookie to Authorization header
api.interceptors.request.use(
  (config) => {
    // 1. Attempt to read the token
    const token = getCookie("authToken");

    if (token) {
      // 2. If valid token is found, set the header correctly
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // 3. 🚨 CRITICAL FIX: If token is null (e.g., during SSR or if cookie is missing),
      //    explicitly delete the header to prevent sending "Bearer null".
      delete config.headers.Authorization; 
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handling (This section is already good)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized: token expired or invalid");

      if (typeof window !== "undefined") {
        // Clear the authToken cookie
        document.cookie =
          "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        // Optionally redirect to signin
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  }
);

export default api;