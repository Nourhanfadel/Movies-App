import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { FaClock, FaStar, FaPlay, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const MovieDetails = () => {
  const { id } = useParams();
  const { data: movie, isLoading, isError } = useMovieDetails(id);
  const [watchModal, setWatchModal] = useState(false);

  if (isLoading) return <p className="text-white p-6">Loading...</p>;
  if (isError || !movie)
    return <p className="text-red-500 p-6">Error loading movie.</p>;

  const trailer = movie?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className="text-white min-h-screen bg-[#111]">
      {/* Trailer or backdrop */}
      <div className="relative h-[60vh]">
        {trailer ? (
          <iframe
            className="w-full h-full object-cover"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=1`}
            title="Movie Trailer"
            allow="autoplay; fullscreen"
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: movie?.backdrop_path
                ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                : "url('/placeholder.jpg')",
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto -mt-40 relative z-10 p-4 md:flex gap-10">
        {/* Poster */}
        <img
          src={
            movie?.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/poster-placeholder.jpg"
          }
          className="w-[250px] rounded-xl shadow-lg mx-auto md:mx-0"
        />

        {/* Movie Info */}
        <div className="flex-1 mt-6 md:mt-0">
          <h1 className="text-4xl font-bold mb-3">{movie?.title || "Untitled"}</h1>

          <div className="flex flex-wrap items-center gap-5 text-gray-300 mb-4">
            <span className="flex items-center gap-2">
              <FaClock /> {movie?.runtime ? `${movie.runtime} min` : "N/A"}
            </span>
            <span className="flex items-center gap-2">
              <FaStar className="text-yellow-400" />{" "}
              {movie?.vote_average?.toFixed(1) || "N/A"}
            </span>
          </div>

          {/* Genres */}
          <div className="flex gap-3 mb-4 flex-wrap">
            {movie?.genres?.map((g) => (
              <span
                key={g.id}
                className="px-3 py-1 bg-gray-700 rounded-full text-sm"
              >
                {g.name}
              </span>
            ))}
          </div>

          {/* Overview */}
          <p className="text-gray-300 leading-6 mb-6">{movie?.overview}</p>

          {/* Buttons */}
          <div className="flex gap-4 flex-wrap">
            {trailer && (
              <a
                href={`https://youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-pink-900 px-5 py-3 rounded-lg hover:bg-pink-700 transition"
              >
                <FaPlay /> Watch Trailer
              </a>
            )}

            <button
              onClick={() => setWatchModal(true)}
              className="inline-flex items-center gap-3 bg-green-600 px-5 py-3 rounded-lg hover:bg-green-700 transition"
            >
              <FaPlay /> Watch Now
            </button>
          </div>
        </div>
      </div>

      {/* Cast */}
      <div className="max-w-5xl mx-auto p-4 mt-10">
        <h2 className="text-2xl font-bold mb-3">Top Cast</h2>
        <div className="flex gap-5 overflow-auto py-2">
          {movie?.credits?.cast?.slice(0, 12)?.map((actor) => (
            <div key={actor.id} className="w-[120px] text-center">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "/actor-placeholder.jpg"
                }
                className="w-full h-auto object-cover rounded-full"
              />
              <p className="text-sm mt-2">{actor.name}</p>
              <p className="text-xs text-gray-400">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Watch Modal */}
      <AnimatePresence>
        {watchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-5xl h-[80vh] bg-black rounded-lg overflow-hidden">
              <button
                onClick={() => setWatchModal(false)}
                className="absolute top-4 right-4 text-white text-2xl z-50"
              >
                <FaTimes />
              </button>
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailer?.key}?autoplay=1&controls=1`}
                title="Watch Movie"
                allow="autoplay; fullscreen"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

{/* Similar Movies Stylish */}
{movie?.similar?.results?.length > 0 && (
  <div className="max-w-6xl mx-auto p-4 mt-10">
    <h2 className="text-2xl font-bold mb-4 text-white">Similar Movies</h2>

    <div className="flex gap-5 overflow-auto py-2  hide-scrollbar">
      {movie.similar.results.slice(0, 12).map((sm) => (
        <Link key={sm.id} to={`/movie/${sm.id}`}>
          <div className="relative min-w-[140px] flex-shrink-0 cursor-pointer group rounded-lg overflow-hidden shadow-lg">
            {/* Poster */}
            <img
              src={`https://image.tmdb.org/t/p/w300${sm.poster_path}`}
              alt={sm.title}
              className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Overlay Info on Hover */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
              <h3 className="text-white font-semibold text-sm">{sm.title}</h3>
              <p className="text-gray-300 text-xs mt-1">
                {sm.release_date?.split("-")[0] || "----"} • {sm.vote_average?.toFixed(1)} ⭐
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
)}

    </div>
  );
};

export default MovieDetails;
