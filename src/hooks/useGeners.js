// hooks/useMoviesApi.js
import { useQuery } from "@tanstack/react-query";
import { getGenres, getMoviesByGenre } from "../api/moviesApi";

export const useGenres = () =>
  useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
    staleTime: 5 * 60 * 1000,
  });

export const useMoviesByGenre = (genreId, page = 1) =>
  useQuery({
    queryKey: ["moviesByGenre", genreId, page],
    queryFn: () => getMoviesByGenre(genreId, page),
    staleTime: 5 * 60 * 1000,
    enabled: !!genreId,
  });
