import { useQuery } from "@tanstack/react-query";
import { getSomeData } from "../api"; // Assuming api/index.js exports getSomeData

const QUERY_KEY = "someData";

export const useSomeData = (params) => {
  return useQuery({
    queryKey: [QUERY_KEY, params], // Include params in queryKey for unique queries
    queryFn: () => getSomeData(params),
    // Add other TanStack Query options here as needed:
    // enabled: !!params.id, // Example: only run query if an ID is present
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // refetchInterval: 1000 * 60, // Refetch every minute
  });
};
