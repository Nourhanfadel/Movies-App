import { FaPlay } from "react-icons/fa";

export default function ContinueWatchingCard({ movie }) {
  return (
    <div className="min-w-[180px] bg-gray-900 rounded-xl shadow-md overflow-hidden hover:scale-105 transition-all cursor-pointer">
      <div className="relative">
        <img
          src={movie.thumbnail}
          alt={movie.title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full">
          <FaPlay className="text-white text-sm" />
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-white font-semibold text-sm">{movie.title}</h3>
        <div className="w-full bg-gray-700 h-2 rounded-full mt-3">
          <div
            className="bg-red-500 h-2 rounded-full"
            style={{ width: `${movie.progress}%` }}
          />
        </div>
        <p className="text-gray-400 text-xs mt-1">{movie.progress}% watched</p>
      </div>
    </div>
  );
}
