import { useQuery } from "@tanstack/react-query";
import habitsData from "../data/habits.json";

// For now, we'll use the mock data directly
// Later this will be replaced with actual API calls
export async function fetchHabitsApi() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return habitsData;
}

export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: fetchHabitsApi,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}
