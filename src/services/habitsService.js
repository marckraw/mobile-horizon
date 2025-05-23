import apiClient from "../api/index";

export const createHabitsService = () => {
  // Private helper function for error handling
  const handleError = (error, operation) => {
    console.error(`API Error ${operation}:`, error.response || error.message);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      `Failed to ${operation}`;
    throw new Error(errorMessage);
  };

  // Private helper function for API requests with error handling
  const makeApiRequest = async (requestFn, operation) => {
    try {
      const response = await requestFn();
      return response.data;
    } catch (error) {
      handleError(error, operation);
    }
  };

  // Public API - matches the actual backend endpoints
  return {
    // Get all habits - GET /api/habits/
    fetchHabits: async () => {
      return makeApiRequest(
        () => apiClient.get("/api/habits/"),
        "fetch habits"
      );
    },

    // Get habit by ID - GET /api/habits/:habitId
    getHabitById: async (habitId) => {
      return makeApiRequest(
        () => apiClient.get(`/api/habits/${habitId}`),
        "get habit by ID"
      );
    },

    // Create a new habit - POST /api/habits/
    // Request body: { name: string, target: number }
    createHabit: async (habitData) => {
      return makeApiRequest(
        () => apiClient.post("/api/habits/", habitData),
        "create habit"
      );
    },

    // Update an existing habit - PUT /api/habits/:habitId
    // Request body: { name: string, target: number }
    updateHabit: async (habitId, habitData) => {
      return makeApiRequest(
        () => apiClient.put(`/api/habits/${habitId}`, habitData),
        "update habit"
      );
    },

    // Delete a habit - DELETE /api/habits/:habitId
    deleteHabit: async (habitId) => {
      return makeApiRequest(
        () => apiClient.delete(`/api/habits/${habitId}`),
        "delete habit"
      );
    },

    // Log habit progress - POST /api/habits/:habitId/log
    // Request body: { progress: number, date: string (ISO format) }
    logHabitProgress: async (habitId, progress, date = null) => {
      const logData = {
        progress,
        date: date || new Date().toISOString(), // Use provided date or current date
      };
      return makeApiRequest(
        () => apiClient.post(`/api/habits/${habitId}/log`, logData),
        "log habit progress"
      );
    },

    // Get habit logs - GET /api/habits/:habitId/logs?days=30
    getHabitLogs: async (habitId, days = 30) => {
      return makeApiRequest(
        () =>
          apiClient.get(`/api/habits/${habitId}/logs`, { params: { days } }),
        "fetch habit logs"
      );
    },
  };
};

// Create and export the service instance
export const habitsService = createHabitsService();
