import MovieCard from "../Components/MovieCard";
import { useWatchlist } from "../hooks/useWatchlist";
import { FaListUl } from "react-icons/fa";
import { Link } from "react-router-dom";

const WatchlistPage = () => {
  const { data: watchlist, isLoading, error } = useWatchlist();
  
  
  const watchlistCount = watchlist?.length || 0;

  if (isLoading) {

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your watchlist...</p>
          <p className="text-gray-500 text-sm mt-2">If this takes too long, check console</p>
        </div>
      </div>
    );
  }

  if (error) {

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Something went wrong</h3>
          <p className="text-gray-400 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      {watchlistCount === 0 ? (
        <div className="text-center mt-20">
          <h3 className="text-2xl font-bold mb-2">Your watchlist is empty</h3>
          <p className="text-gray-400 mb-6">
            Add movies to your watchlist to watch them later.
          </p>
          <Link
            to="/"
            className="inline-block bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-lg font-semibold transition"
          >
            Discover Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {watchlist.map((movie) => (
            <div key={movie.id} className="flex flex-col">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;