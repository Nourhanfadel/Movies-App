import { motion } from "framer-motion";
import { FaHeart, FaListUl, FaPlay, FaRegHeart, FaList } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { Link } from "react-router-dom";
import { useFavoriteMovies, useToggleFavorite } from "../hooks/useFavoriteMovies";
import { useWatchlist, useToggleWatchlist } from "../hooks/useWatchlist";
import { useState } from "react";
import WatchNowModal from "./WatchNowModal";

const MovieCard = ({ movie }) => {
  const { data: movieDetails } = useMovieDetails(movie.id);
  const { data: favorites = [] } = useFavoriteMovies();
  const { data: watchlist = [] } = useWatchlist();
  const { mutate: toggleFavorite, isPending: isFavPending } = useToggleFavorite();
  const { mutate: toggleWatchlist, isPending: isWatchPending } = useToggleWatchlist();
  const [openModal, setOpenModal] = useState(false);


  const isFav = favorites?.some((m) => m.id === movie.id);
  const isInWatchlist = watchlist?.some((m) => m.id === movie.id);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Toggling favorite for movie:", movie.id, movie.title);
    toggleFavorite(movie);
  };

  const handleToggleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Toggling watchlist for movie:", movie.id, movie.title);
    toggleWatchlist(movie);
  };

   const handleWatchNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenModal(true);
  };

  return (
    <>
    <Link to={`/movie/${movie.id}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg bg-[#111]"
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-[320px] object-cover"
        />

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        >
          <div className="absolute bottom-4 w-full text-center px-3">
            <h3 className="text-white text-lg font-semibold">{movie.title}</h3>
            <p className="text-gray-300 text-sm mt-1">
              {movieDetails?.release_date?.split("-")[0] || "---"} •{" "}
              {movieDetails?.runtime
                ? `${Math.floor(movieDetails.runtime / 60)}h ${
                    movieDetails.runtime % 60
                  }m`
                : "N/A"}
            </p>
          </div>

          <div
            className="absolute top-1/2 left-2 transform -translate-y-1/2 flex flex-col gap-3
                        opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <button
              data-tooltip-id={`favTip-${movie.id}`}
              data-tooltip-content={isFav ? "Remove from Favorites" : "Add to Favorites"}
              className={`w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-all duration-200 ${
                isFavPending ? "opacity-50 cursor-wait" : "bg-white/10 hover:bg-pink-700"
              }`}
              onClick={handleToggleFavorite}
              disabled={isFavPending}
            >
              {isFav ? (
                <FaHeart className="text-pink-500 text-sm" />
              ) : (
                <FaRegHeart className="text-white text-sm" />
              )}
            </button>
            <button
              data-tooltip-id={`listTip-${movie.id}`}
              data-tooltip-content={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              className={`w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-all duration-200 ${
                isWatchPending ? "opacity-50 cursor-wait" : "bg-white/10 hover:bg-pink-700"
              }`}
              onClick={handleToggleWatchlist}
              disabled={isWatchPending}
            >
              {isInWatchlist ? (
                <FaList className="text-pink-700 text-sm" />
              ) : (
                <FaListUl className="text-white text-sm" />
              )}
            </button>

       
            <button
              data-tooltip-id={`playTip-${movie.id}`}
              data-tooltip-content="Watch Now"
              className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-pink-700 rounded-full shadow-md transition-all duration-200"
              onClick={handleWatchNow}
            >
              <FaPlay className="text-white text-sm" />
            </button>
          </div>
        </div>

        <Tooltip
          id={`favTip-${movie.id}`}
          place="top"
          style={{
            fontSize: "10px",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "4px 6px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        />
        <Tooltip
          id={`listTip-${movie.id}`}
          place="top"
          style={{
            fontSize: "10px",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "4px 6px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        />
        <Tooltip
          id={`playTip-${movie.id}`}
          place="top"
          style={{
            fontSize: "10px",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "4px 6px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        />
      </motion.div>
    </Link>

      {movieDetails && (
        <WatchNowModal
          movie={movieDetails}
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}
      </>


  );
};

export default MovieCard;