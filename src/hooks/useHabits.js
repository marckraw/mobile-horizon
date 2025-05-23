import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { habitsService } from "../services/habitsService";

// Query key constants for better cache management
export const HABITS_QUERY_KEY = "habits";

// Hook to fetch all habits
export function useHabits() {
  return useQuery({
    queryKey: [HABITS_QUERY_KEY],
    queryFn: habitsService.fetchHabits,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

// Hook to fetch a single habit by ID
export function useHabit(habitId) {
  return useQuery({
    queryKey: [HABITS_QUERY_KEY, habitId],
    queryFn: () => habitsService.getHabitById(habitId),
    enabled: !!habitId, // Only run if habitId is provided
  });
}

// Hook to fetch habit logs
export function useHabitLogs(habitId, days = 30) {
  return useQuery({
    queryKey: [HABITS_QUERY_KEY, habitId, "logs", days],
    queryFn: () => habitsService.getHabitLogs(habitId, days),
    enabled: !!habitId, // Only run if habitId is provided
  });
}

// Hook to create a new habit
export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: habitsService.createHabit,
    onSuccess: () => {
      // Invalidate and refetch habits list
      queryClient.invalidateQueries({ queryKey: [HABITS_QUERY_KEY] });
    },
  });
}

// Hook to update an existing habit
export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, habitData }) =>
      habitsService.updateHabit(habitId, habitData),
    onSuccess: (data, variables) => {
      // Invalidate habits list and specific habit
      queryClient.invalidateQueries({ queryKey: [HABITS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [HABITS_QUERY_KEY, variables.habitId],
      });
    },
  });
}

// Hook to delete a habit
export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: habitsService.deleteHabit,
    onSuccess: () => {
      // Invalidate and refetch habits list
      queryClient.invalidateQueries({ queryKey: [HABITS_QUERY_KEY] });
    },
  });
}

// Hook to log habit progress
export function useLogHabitProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, progress, date }) =>
      habitsService.logHabitProgress(habitId, progress, date),
    onSuccess: (data, variables) => {
      // Invalidate habits list, specific habit, and its logs
      queryClient.invalidateQueries({ queryKey: [HABITS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [HABITS_QUERY_KEY, variables.habitId],
      });
      queryClient.invalidateQueries({
        queryKey: [HABITS_QUERY_KEY, variables.habitId, "logs"],
      });
    },
  });
}
