import { useParams } from "react-router-dom";
import MovieCard from "../Components/MovieCard";
import { usePopularMovies } from "../hooks/usePopularMovies";
import { useTopRatedMovies } from "../hooks/useTopRatedMovies";
import { useUpcomingMovies } from "../hooks/useUpcomingMovies";
import { useTrendingMovies } from "../hooks/useTrendingMovies";
import Loader from "../Components/Loader";

function MoviesList() {
  const { category } = useParams();

  const hooksMap = {
    popular: usePopularMovies(),
    top_rated: useTopRatedMovies(),
    upcoming: useUpcomingMovies(),
    now_playing: useTrendingMovies(),
  };

  const current = hooksMap[category];

  if (!current) {
    return <p className="text-white p-5 text-xl">Invalid Category</p>;
  }

  const { data, isLoading, error } = current;

  if (isLoading) return <Loader />;
  if (error) return <p className="text-white p-5">Error fetching movies</p>;

  const movies = data?.results || [];

  return (
    <div className="bg-black min-h-screen text-white px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize text-pink-900">
        {category.replace("_", " ")} Movies
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default MoviesList;
