import axios from "axios";

// Replace with your actual backend API base URL
const API_BASE_URL = "https://hq-thegrid-production-c370.up.railway.app";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Add other common headers here, e.g., for authentication
  },
});

// Interceptor to add Authorization header
// We'll need a more robust way to manage the token (e.g., from state/storage)
let authToken = null; // Placeholder

export const setAuthToken = (token) => {
  authToken = token;
};

apiClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Example API function (we'll make this more concrete later)
export const getSomeData = async (params) => {
  try {
    const response = await apiClient.get("/some-endpoint", { params });
    return response.data;
  } catch (error) {
    // Handle or throw error appropriately
    console.error(
      "API Error fetching someData:",
      error.response || error.message
    );
    throw error.response?.data || error.message || "An unknown error occurred";
  }
};

// Add more API functions here as needed:
// export const postSomeData = async (data) => { ... };
// export const updateSomeData = async (id, data) => { ... };

export default apiClient;
