import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWatchlist, toggleWatchlistMovie } from "../api/moviesApi";

export const useWatchlist = () => {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      console.log("🔄 Fetching watchlist...");
      const data = await getWatchlist();
      console.log("✅ Watchlist fetched:", data);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 3, 
    retryDelay: 1000, 
  });
};

export const useToggleWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleWatchlistMovie,
    onSuccess: () => {
      console.log("Watchlist toggle successful, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
    onError: (error) => {
      console.error("Watchlist toggle error:", error);
    },
  });
};