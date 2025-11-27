import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchSearchMovies } from "../api/moviesApi";


export const useSearchMoviesInfinite = (searchTerm) => {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  // debounce
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTerm(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // useInfiniteQuery: object signature required in v5
  const query = useInfiniteQuery({
    queryKey: ["search", debouncedTerm],
    queryFn: fetchSearchMovies,
    enabled: !!debouncedTerm,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) return lastPage.page + 1;
      return undefined;
    },
    keepPreviousData: true,
  });

  return query;
};