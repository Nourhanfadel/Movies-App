import MovieCard from "../Components/MovieCard";
import { useFavoriteMovies } from "../hooks/useFavoriteMovies";

const FavoritesPage = () => {
  const { data: favorites } = useFavoriteMovies();
  const favoritesCount = favorites?.length || 0;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8 ">

      {favoritesCount === 0 ? (
        <div className="text-center mt-20">
          <h3 className="text-2xl font-bold mb-2">No favorite movies yet</h3>
          <p className="text-gray-400">Add movies to your favorites to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {favorites.map((movie) => (
            <div key={movie.id} className="flex flex-col">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
