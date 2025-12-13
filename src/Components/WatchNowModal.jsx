
import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const SAVE_INTERVAL = 15;

const WatchNowModal = ({ movie, open, onClose, onFinish }) => {
  const { user } = useAuth();

  const [progressPercent, setProgressPercent] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const lastSavedRef = useRef(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open || !user || !movie?.id) return;

    const loadProgress = async () => {
      const { data } = await supabase
        .from("continue_watching")
        .select("progress")
        .eq("user_id", user.id)
        .eq("movie_id", movie.id)
        .maybeSingle();

      setProgressPercent(data?.progress || 0);
    };

    loadProgress();
  }, [open, user, movie?.id]);

  /* ============================
     INIT YOUTUBE PLAYER
  ============================ */
  useEffect(() => {
    if (!open || !movie) return;

    // load iframe api once
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    const initPlayer = () => {
      if (!window.YT?.Player) {
        setTimeout(initPlayer, 100);
        return;
      }

      const trailer = movie?.videos?.results?.find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
      );
      if (!trailer) return;

      // destroy old player
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      playerRef.current = new window.YT.Player("card-player", {
        videoId: trailer.key,
        playerVars: {
          autoplay: 1,
          controls: 1,
        },
        events: {
          onReady: (e) => {
            const duration = e.target.getDuration();
            setVideoDuration(duration);

            if (progressPercent > 0) {
              const startSeconds =
                (progressPercent / 100) * duration;
              e.target.seekTo(startSeconds, true);
            }

            intervalRef.current = setInterval(() => {
              const current = e.target.getCurrentTime();

              // save every 15s only
              if (current - lastSavedRef.current >= SAVE_INTERVAL) {
                lastSavedRef.current = current;
                saveProgress(current, duration);
              }
            }, 1000);
          },
        },
      });
    };

    initPlayer();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [open, movie, progressPercent]);

  /* ============================
     SAVE PROGRESS
  ============================ */
  const saveProgress = async (currentTime, duration) => {
    if (!user || !movie?.id || !duration) return;

    const percentage = Math.min(
      (currentTime / duration) * 100,
      100
    );

    if (percentage >= 90) {
      await supabase
        .from("continue_watching")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movie.id);

    queryClient.setQueryData(
      ["continueWatching", user.id],
      (old = []) => old.filter((m) => m.movie_id !== movie.id)
    );

      onFinish?.(movie.id);
  } else {
    const payload = {
      user_id: user.id,
      movie_id: movie.id,
      title: movie.title,
      thumbnail: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      progress: percentage,
    };

    await supabase
      .from("continue_watching")
      .upsert(payload, { onConflict: "user_id, movie_id" });

    queryClient.setQueryData(
      ["continueWatching", user.id],
      (old = []) => {
        const exists = old.find((m) => m.movie_id === movie.id);

        if (exists) {
          return old.map((m) =>
            m.movie_id === movie.id ? { ...m, ...payload } : m
          );
        }

        return [{ ...payload }, ...old];
      }
    );
  }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="relative bg-black p-4 rounded-xl w-[90%] max-w-3xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl"
        >
          <FaTimes />
        </button>

        <div id="card-player" className="w-full h-[400px]" />
      </div>
    </div>
  );
};

export default WatchNowModal;
