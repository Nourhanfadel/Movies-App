import { useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../api/moviesApi";


export const usePopularMovies = () => {
  return useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => fetchMovies("popular"),
    staleTime: 1000 * 60 * 5,
  });
};
