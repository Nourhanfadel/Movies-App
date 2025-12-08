import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export function useContinueWatching(userId) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
  console.log("HOOK RECEIVED userId =", userId);
}, [userId]);


  useEffect(() => {
    if (!userId) return;

    const fetchMovies = async () => {
      const { data, error } = await supabase
        .from("continue_watching")
        .select("*")
        .eq("user_id", userId)
        .gt("progress", 0)
        .lt("progress", 100);

      if (error || !data) return;

      const fullMovies = await Promise.all(
        data.map(async (item) => {
          try {
            const res = await fetch(
              `https://api.themoviedb.org/3/movie/${item.movie_id}?api_key=${TMDB_KEY}`
            );
            const movie = await res.json();

            return {
              movie_id: item.movie_id,
              progress: item.progress,
              title: movie.title || "Unknown",
              thumbnail: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/no-image.png",
            };
          } catch {
            return null;
          }
        })
      );

      // remove null items
      setMovies(fullMovies.filter(Boolean));
    };

    fetchMovies();
  }, [userId]);

  return movies;
}
