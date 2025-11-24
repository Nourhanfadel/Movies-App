// import { motion } from "framer-motion";
import { FaHeart, FaListUl, FaPlay } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const MovieCard = ({ movie }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.08 }}
      className="relative group cursor-pointer"
    >
      {/* Poster */}
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-[320px] object-cover rounded-2xl shadow-lg"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
                   rounded-2xl opacity-0 group-hover:opacity-100 
                   transition-opacity duration-300"
      >
        {/* Icons */}
        <div className="flex justify-center gap-5 absolute top-6 left-1/2 -translate-x-1/2">
          {/* Favorite */}
          <button
            data-tooltip-id="favTip"
            data-tooltip-content="Add to Favorites"
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full 
                       transition-all duration-200 shadow-md"
          >
            <FaHeart className="text-white text-xl" />
          </button>

          {/* Add to List */}
          <button
            data-tooltip-id="listTip"
            data-tooltip-content="Add to Watchlist"
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full 
                       transition-all duration-200 shadow-md"
          >
            <FaListUl className="text-white text-xl" />
          </button>

          {/* Play */}
          <button
            data-tooltip-id="playTip"
            data-tooltip-content="Watch Now"
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full 
                       transition-all duration-200 shadow-md"
          >
            <FaPlay className="text-white text-xl" />
          </button>
        </div>

        {/* Tooltips */}
        <Tooltip id="favTip" place="top" />
        <Tooltip id="listTip" place="top" />
        <Tooltip id="playTip" place="top" />

        {/* Movie Info */}
        <div className="absolute bottom-5 left-0 w-full px-4">
          <h3 className="text-white text-xl font-semibold drop-shadow-lg">
            {movie.title}
          </h3>
          <p className="text-gray-300 text-sm mt-1">
            {movie.release_date?.slice(0, 4)} • {movie.original_language?.toUpperCase()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
