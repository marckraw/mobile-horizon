import axios from "axios";

// Backend API base URL from your Postman collection
const API_BASE_URL = "https://hq-thegrid-production-c370.up.railway.app";

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

// Add more API functions here as needed:
// export const postSomeData = async (data) => { ... };
// export const updateSomeData = async (id, data) => { ... };

export default apiClient;
