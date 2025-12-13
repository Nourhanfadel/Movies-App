import { useSearchParams } from "react-router-dom";
import React from "react";
import MovieCard from "../Components/MovieCard";
import { useSearchMoviesInfinite } from "../hooks/useSearchMovies";
import Loader from "../Components/Loader";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchMoviesInfinite(query);

  const observer = React.useRef();
  const lastMovieRef = React.useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return (
    <div className="p-4 bg-black min-h-screen">
      {isLoading && <Loader/>}
      {isError && <p>Error fetching movies</p>}
      {data?.pages[0]?.results?.length === 0 && query && <p>No results found.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4">
        {data?.pages.map((page) =>
          page.results.map((movie, index) => {
            const isLastMovie =
              page.results.length - 1 === index && page === data.pages[data.pages.length - 1];
            return (
              <MovieCard
                key={movie.id}
                movie={movie}
                ref={isLastMovie ? lastMovieRef : null}
              />
            );
          })
        )}
      </div>

      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
}
