import axios from "axios";

// Backend API base URL and API key from environment variables
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://hq-thegrid-production-c370.up.railway.app";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

console.log("API_BASE_URL: ", API_BASE_URL);
console.log("API_KEY: ", API_KEY);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication token management
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

export const getAuthToken = () => {
  return authToken;
};

// Request interceptor to add Authorization header
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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response Error:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request Error:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Export the API key for use in initialization
export { API_KEY };
export default apiClient;
