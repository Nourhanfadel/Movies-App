// hooks/usePopularActors.js
import { useQuery } from "@tanstack/react-query";
import { fetchPopularActors } from "../api/moviesApi";
// import { fetchPopularActors } from "../api/actors";

export const usePopularActors = () => {
  return useQuery({
    queryKey: ["actors", "popular"],
    queryFn: fetchPopularActors,
    staleTime: 1000 * 60 * 5,
  });
};
