import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavoriteMovie } from "../api/moviesApi";


export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavoriteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
    },
  });
};