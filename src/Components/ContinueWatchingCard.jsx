

import { FaPlay, FaTimes } from "react-icons/fa";

export default function ContinueWatchingCard({
  movie,
  onClick,
  onRemove, 
}) {
  return (
    <div
      onClick={() => onClick(movie)}
      className="relative min-w-[180px] bg-gray-900 rounded-xl shadow-md overflow-hidden hover:scale-105 transition-all cursor-pointer"
    >
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          onRemove(movie);
        }}
        className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full"
      >
        <FaTimes size={12} />
      </button>

      <div className="relative">
        <img
          src={movie.thumbnail || "/placeholder.jpg"}
          alt={movie.title || "Movie"}
          className="w-full h-40 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full">
          <FaPlay className="text-white text-sm" />
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-white font-semibold text-sm">
          {movie.title || "Unknown"}
        </h3>

        <div className="w-full bg-gray-700 h-2 rounded-full mt-3">
          <div
            className="h-full bg-pink-600 rounded"
            style={{ width: `${movie.progress || 0}%` }}
          />
        </div>

        <p className="text-gray-400 text-xs mt-1">
          {movie.progress?.toFixed(0) || 0}% watched
        </p>
      </div>
    </div>
  );
}
