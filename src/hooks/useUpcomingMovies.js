import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../api/moviesApi";

export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: ["movies", "upcoming"],
    queryFn: () => fetchMovies("upcoming"),
    staleTime: 1000 * 60 * 5,
  });
};
