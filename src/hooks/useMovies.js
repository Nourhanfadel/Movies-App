import { useQuery } from "@tanstack/react-query";
import { getPopularMovies } from "../api/moviesApi";

export const useMovies = () => {
  return useQuery({
    queryKey: ["popularMovies"],
    queryFn: getPopularMovies,
  });
};
