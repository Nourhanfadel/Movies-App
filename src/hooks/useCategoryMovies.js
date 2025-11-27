import { useQuery } from '@tanstack/react-query';
import { fetchCategoryMovies } from '../api/moviesApi';


export const useCategoryMovies = (category, page = 1) => {
  return useQuery({
    queryKey: ['category', category, page],
    queryFn: () => fetchCategoryMovies(category, page),
    staleTime: 5 * 60 * 1000,
    enabled: !!category,
  });
};