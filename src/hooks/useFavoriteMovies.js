import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../api/moviesApi";



export const useFavoriteMovies = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });
};
