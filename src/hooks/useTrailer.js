import { useQuery } from "@tanstack/react-query";
import { tmbd } from "../api/tmdb";

const apiKey = "707a6ad42842c1872f886101e63e0c78";

export const useMoviesWithTrailer = () => {
  return useQuery({
    queryKey: ["moviesWithTrailer"],
    queryFn: async () => {
  
      const { data } = await tmbd.get(
        `/movie/popular?api_key=${apiKey}&language=en-US&page=1`
      );


      const moviesWithTrailer = await Promise.all(
        data.results.map(async (movie) => {
          try {
            const trailerRes = await tmbd.get(`/movie/${movie.id}/videos?api_key=${apiKey}`);
            const trailer = trailerRes.data.results?.find(
              (v) => v.type === "Trailer" && v.site === "YouTube"
            );

            if (trailer) {
              return { ...movie, trailerKey: trailer.key };
            }
            return null;
          } catch {
            return null;
          }
        })
      );

      const filteredMovies = moviesWithTrailer.filter(Boolean);

      const movieOfWeek = filteredMovies[0];

      return { movieOfWeek, moviesWithTrailer: filteredMovies };
    },
  });
};
