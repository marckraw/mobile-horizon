import api from "./api.config";

export const createApiService = ({ api }) => {
  // Private state/functions inside closure
  const handleError = (error) => {
    console.error("API Error:", error);
    throw error;
  };

  // Return public API
  return {
    getData: async () => {
      try {
        const response = await api.get("/endpoint");
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    postData: async (data) => {
      try {
        const response = await api.post("/endpoint", data);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    updateData: async (id, data) => {
      try {
        const response = await api.put(`/endpoint/${id}`, data);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    deleteData: async (id) => {
      try {
        const response = await api.delete(`/endpoint/${id}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },
  };
};

// Create and export the service instance
export const apiService = createApiService({ api });
