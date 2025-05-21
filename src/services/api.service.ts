import { AxiosInstance, AxiosResponse } from "axios";
import api from "./api.config";

interface ApiService {
  getAllSignals: () => Promise<any>;
  postData: (data: any) => Promise<any>;
  updateData: (id: string | number, data: any) => Promise<any>;
  deleteData: (id: string | number) => Promise<any>;
}

interface ApiServiceConfig {
  api: AxiosInstance;
}

export const createApiService = ({ api }: ApiServiceConfig): ApiService => {
  // Private state/functions inside closure
  const handleError = (error: Error): never => {
    console.error("API Error:", error);
    throw error;
  };

  // Return public API
  return {
    getAllSignals: async (): Promise<any> => {
      try {
        const response: AxiosResponse = await api.get("/api/signals?limit=10");
        console.log("lahskdjhakjshdkj");
        console.log(response.data);
        return response.data;
      } catch (error) {
        return handleError(error as Error);
      }
    },

    postData: async (data: any): Promise<any> => {
      try {
        const response: AxiosResponse = await api.post("/endpoint", data);
        return response.data;
      } catch (error) {
        return handleError(error as Error);
      }
    },

    updateData: async (id: string | number, data: any): Promise<any> => {
      try {
        const response: AxiosResponse = await api.put(`/endpoint/${id}`, data);
        return response.data;
      } catch (error) {
        return handleError(error as Error);
      }
    },

    deleteData: async (id: string | number): Promise<any> => {
      try {
        const response: AxiosResponse = await api.delete(`/endpoint/${id}`);
        return response.data;
      } catch (error) {
        return handleError(error as Error);
      }
    },
  };
};

// Create and export the service instance
export const apiService = createApiService({ api });
