



import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { useAuth } from "../context/AuthContext";
import { FaClock, FaStar, FaPlay, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import Loader from "../Components/Loader";

const MovieDetails = () => {
  const { id } = useParams();
  const { data: movie, isLoading, isError } = useMovieDetails(id);
  const { user } = useAuth();

  const [watchModal, setWatchModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [startFrom, setStartFrom] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const shouldResetRef = useRef(false);

  // Load progress from Supabase
  useEffect(() => {
    const loadProgress = async () => {
      if (!user || !movie?.runtime) return;

      try {
        const { data, error } = await supabase
          .from("continue_watching")
          .select("progress")
          .eq("user_id", user.id)
          .eq("movie_id", Number(id))
          .maybeSingle();

        if (!error && data?.progress) {
          const runtimeSeconds = movie.runtime * 60;
          const seconds = (data.progress / 100) * runtimeSeconds;
          setStartFrom(Math.floor(seconds));
          console.log(" Loaded progress:", data.progress + "%", "→ Start at:", Math.floor(seconds) + "s");
        }
      } catch (err) {
        console.error(" Error loading progress:", err);
      }
    };

    if (movie && user) {
      loadProgress();
    }
  }, [id, user, movie]);

  useEffect(() => {
    if (!watchModal) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      playerRef.current = null;
      return;
    }

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 100);
        return;
      }

      const trailer = movie?.videos?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );

      if (!trailer) return;

      try {
        new window.YT.Player('movie-player', {
          videoId: trailer.key,
          playerVars: {
            autoplay: 1,
            controls: 1,
            start: Math.floor(startFrom),
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              console.log(" Player ready");
              const p = event.target;
              playerRef.current = p;
    
              try {
                const dur = p.getDuration();
                if (dur > 0) {
                  setVideoDuration(dur);
                  console.log(" Video duration:", Math.floor(dur) + "s");
                }
              } catch (err) {
                console.error("Error getting duration:", err);
              }
              

              setTimeout(() => {
                console.log(" Starting time tracking interval...");
                
                intervalRef.current = setInterval(() => {
                  try {
                    const player = playerRef.current;
                    if (player && typeof player.getCurrentTime === 'function') {
                      const time = player.getCurrentTime();
                      if (time > 0) {
                        console.log(" Current time:", Math.floor(time) + "s");
                        setCurrentTime(time);
                      }
                    }
                  } catch (err) {
                    console.error(" Error getting time:", err);
                  }
                }, 3000);
              }, 1000);
            },
            onStateChange: (event) => {
              if (event.data === 1) {
                console.log("Playing started");
              }
            }
          }
        });
      } catch (err) {
        console.error(" Player initialization error:", err);
      }
    };

    initPlayer();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [watchModal, movie, startFrom]);

 
  useEffect(() => {
    if (!user || !currentTime || currentTime < 5) {
      return;
    }

    console.log("🔄 Save effect triggered - Time:", Math.floor(currentTime) + "s");

    const saveToDb = async () => {
  console.log(" saveToDb FUNCTION STARTED!");
  
  let duration = videoDuration;
  
  if (!duration && movie?.runtime) {
    duration = movie.runtime * 60;
    console.log("📏 Using movie runtime:", duration + "s");
  }
  
  if (!duration) {
    duration = currentTime * 3;
    console.log("📏 Using estimate:", duration + "s");
  }

  const percentage = Math.min((currentTime / duration) * 100, 100);

  console.log(" SAVING TO DB:", {
    currentTime: Math.floor(currentTime) + "s",
    duration: Math.floor(duration) + "s",
    percentage: Math.round(percentage * 10) / 10 + "%",
    user: user?.id,
    movieId: id
  });

  try {
    if (percentage >= 90) {
      const { error } = await supabase
        .from("continue_watching")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", Number(id));

      if (error) {
        console.error(" Delete error:", error);
      } else {
        console.log(" Movie completed - removed");
      }
      return;
    }

    const dataToSave = {
      user_id: user.id,
      movie_id: Number(id),
      progress: Math.round(percentage * 10) / 10,
      title: movie.title,
      thumbnail: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",
      updated_at: new Date().toISOString(),
    };



    const { data, error } = await supabase
      .from("continue_watching")
      .upsert(dataToSave, { onConflict: "user_id,movie_id" })
      .select();

    if (error) {
      console.error(" Save error:", error);
      console.error(" Error message:", error.message);
      console.error(" Error details:", error.details);
    } else {
      console.log(" SAVED SUCCESSFULLY! ");
      console.log("Saved data:", data);
    }
  } catch (err) {
    console.error(" Exception in saveToDb:", err);
    console.error(" Exception message:", err.message);
    console.error(" Exception stack:", err.stack);
  }
};

console.log(" Setting timeout for 3 seconds...");
const timeout = setTimeout(saveToDb, 3000);
return () => {
  console.log(" Cleaning up timeout");
  clearTimeout(timeout);
};


    
  }, [currentTime, user, id, movie, videoDuration]);

  if (isLoading) return <Loader/>;
  if (isError || !movie)
    return <p className="text-red-500 p-6">Error loading movie.</p>;

  const trailer = movie?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  const handleWatchNow = () => {
    setCurrentTime(0);
    setVideoDuration(0);
    setWatchModal(true);
  };

  return (
    <div className="text-white min-h-screen bg-[#111]">
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

      <div className="max-w-5xl mx-auto -mt-40 relative z-10 p-4 md:flex gap-10">
        <img
          src={
            movie?.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/poster-placeholder.jpg"
          }
          className="w-[250px] rounded-xl shadow-lg mx-auto md:mx-0"
          alt={movie?.title}
        />

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

          <p className="text-gray-300 leading-6 mb-6">{movie?.overview}</p>

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
              onClick={handleWatchNow}
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
        <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide gap-4 scroll-smooth">
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


      {/* WATCH MODAL */}
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
                className="absolute top-4 right-4 text-white text-2xl z-50 bg-black/50 rounded-full p-2 hover:bg-black/70"
              >
                <FaTimes />
              </button>

              <div id="movie-player" className="w-full h-full"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieDetails;
