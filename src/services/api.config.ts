import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { apiConfig } from "../config";
import { env } from "expo-env";

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${env.EXPO_PUBLIC_API_TOKEN}`,
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    // You can add auth token here if needed
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<AxiosError> => {
    // Handle common errors here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response Error:", error.response.data);
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

export default api;
