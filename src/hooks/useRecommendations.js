import { useQuery } from "@tanstack/react-query";
import { getRecommendations } from "../api/moviesApi";

export const useRecommendations = () => {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: getRecommendations,
    staleTime: 1000 * 60 * 30,
  });
};