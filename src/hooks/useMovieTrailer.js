// src/hooks/useMovieTrailer.js
import { useQuery } from "@tanstack/react-query";
import { getMovieTrailer } from "../api/moviesApi";

export const useMovieTrailer = (movieId) => {
  return useQuery({
    queryKey: ["movieTrailer", movieId],
    queryFn: async () => {
      const videos = await getMovieTrailer(movieId);

      const trailer = videos?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );

      return trailer ? trailer.key : null;
    },
    staleTime: 1000 * 60 * 30,
    enabled: !!movieId,
  });
};
