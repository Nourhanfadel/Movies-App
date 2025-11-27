import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../api/moviesApi";

export const useTopRatedMovies = () => {
  return useQuery({
    queryKey: ["movies", "top_rated"],
    queryFn: () => fetchMovies("top_rated"),
    staleTime: 1000 * 60 * 5,
  });
};
