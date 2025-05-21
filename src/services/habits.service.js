import api from "./api.config";

const mockHabits = [
  { id: 1, name: "Morning Run", date: "2024-06-01" },
  { id: 2, name: "Meditation", date: "2024-06-02" },
  { id: 3, name: "Read a Book", date: "2024-06-03" },
];

export async function getHabits() {
  try {
    // const response = await api.get("/habits");
    // return response.data;
    return Promise.resolve(mockHabits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    throw error;
  }
}

export async function addHabit(data) {
  try {
    // const response = await api.post("/habits", data);
    // return response.data;
    return Promise.resolve({ ...data, id: Date.now() });
  } catch (error) {
    console.error("Error adding habit:", error);
    throw error;
  }
}

export async function updateHabit(id, data) {
  try {
    // const response = await api.put(`/habits/${id}`, data);
    // return response.data;
    return Promise.resolve({ id, ...data });
  } catch (error) {
    console.error("Error updating habit:", error);
    throw error;
  }
}

export async function deleteHabit(id) {
  try {
    // const response = await api.delete(`/habits/${id}`);
    // return response.data;
    return Promise.resolve({ success: true });
  } catch (error) {
    console.error("Error deleting habit:", error);
    throw error;
  }
}
