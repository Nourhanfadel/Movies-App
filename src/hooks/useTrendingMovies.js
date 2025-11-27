import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../api/moviesApi";

export const useTrendingMovies = () => {
  return useQuery({
    queryKey: ["movies", "now_playing"],
    queryFn: () => fetchMovies("now_playing"),
    staleTime: 1000 * 60 * 5,
  });
};
