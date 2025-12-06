import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, toggleFavoriteMovie } from "../api/moviesApi";

export const useFavoriteMovies = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    staleTime: 1000 * 60 * 5, 
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavoriteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};