
import { useQuery } from "@tanstack/react-query";
import { tmbd } from "../api/tmdb";

const API_KEY = "707a6ad42842c1872f886101e63e0c78";

const fetchMovies = async (category) => {
  const { data } = await tmbd.get(`/movie/${category}?api_key=${API_KEY}&language=en-US&page=1`);
  return data;
};

export const usePopularMovies = () => {
  return useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => fetchMovies("popular"),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTopRatedMovies = () => {
  return useQuery({
    queryKey: ["movies", "top_rated"],
    queryFn: () => fetchMovies("top_rated"),
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: ["movies", "upcoming"],
    queryFn: () => fetchMovies("upcoming"),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTrendingMovies = () => {
  return useQuery({
    queryKey: ["movies", "now_playing"],
    queryFn: () => fetchMovies("now_playing"),
    staleTime: 1000 * 60 * 5,
  });
};
