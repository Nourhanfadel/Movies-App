

// import { useEffect, useRef, useState } from "react";
// import { FaTimes } from "react-icons/fa";
// import { supabase } from "../lib/supabase";
// import { useAuth } from "../context/AuthContext";

// const WatchNowModal = ({ movie, open, onClose, onFinish  }) => {
//   const { user } = useAuth();

//   const [startFrom, setStartFrom] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [videoDuration, setVideoDuration] = useState(0);

//   const playerRef = useRef(null);
//   const intervalRef = useRef(null);

//   /** ============================
//    * LOAD PROGRESS FROM SUPABASE
//    * ============================ */
//   useEffect(() => {
//     if (!user || !movie?.id) return;

//     const loadProgress = async () => {
//       const { data } = await supabase
//         .from("continue_watching")
//         .select("progress")
//         .eq("user_id", user.id)
//         .eq("movie_id", movie.id)
//         .maybeSingle();

//       if (data?.progress) {
//           setStartFrom(data.progress);

//       }
//     };

//     loadProgress();
//   }, [movie, user]);

//   /** ============================
//    * YOUTUBE PLAYER INIT
//    * ============================ */
//   useEffect(() => {
//     if (!open) {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       return;
//     }

//     if (!window.YT) {
//       const tag = document.createElement("script");
//       tag.src = "https://www.youtube.com/iframe_api";
//       document.body.appendChild(tag);
//     }

//     const initPlayer = () => {
//       if (!window.YT?.Player) {
//         setTimeout(initPlayer, 100);
//         return;
//       }

//       const trailer = movie?.videos?.results?.find(
//         (v) => v.type === "Trailer" && v.site === "YouTube"
//       );
//       if (!trailer) return;


//       if (playerRef.current) {
//   playerRef.current.destroy();
//   playerRef.current = null;
// }

//       new window.YT.Player("card-player", {
//         videoId: trailer.key,
//         playerVars: {
//           autoplay: 1,
//           controls: 1,
//         },
//         events: {
// onReady: (event) => {
//   playerRef.current = event.target;

//   const duration = event.target.getDuration();
//   setVideoDuration(duration);

//   // ✅ تحويل النسبة لثواني
//   if (startFrom > 0) {
//     const startSeconds = (startFrom / 100) * duration;
//     event.target.seekTo(startSeconds, true);
//   }

//   intervalRef.current = setInterval(() => {
//     const t = event.target.getCurrentTime();
//     setCurrentTime(t);
//   }, 3000);
// },

//         },
//       });
//     };

//     initPlayer();

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [open, movie, startFrom]);

//   /** ============================
//    * SAVE PROGRESS TO SUPABASE
//    * ============================ */
// useEffect(() => {
//   if (!user || !videoDuration || currentTime < 5) return;

//   const saveProgress = async () => {
//     const percentage = Math.min(
//       (currentTime / videoDuration) * 100,
//       100
//     );

//     if (percentage >= 90) {
//       await supabase
//         .from("continue_watching")
//         .delete()
//         .eq("user_id", user.id)
//         .eq("movie_id", movie.id);

//       onFinish?.(movie.id);
//     } else {
//       await supabase.from("continue_watching").upsert(
//         {
//           user_id: user.id,
//           movie_id: movie.id,
//           progress: percentage,
//         },
//         { onConflict: "user_id, movie_id" }
//       );
//     }
//   };

//   saveProgress();
// }, [currentTime, videoDuration]);



//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
//       <div className="relative bg-black p-4 rounded-xl w-[90%] max-w-3xl">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-white text-xl"
//         >
//           <FaTimes />
//         </button>

//         <div id="card-player" className="w-full h-[400px]" />
//       </div>
//     </div>
//   );
// };

// export default WatchNowModal;



import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const SAVE_INTERVAL = 15; // seconds

const WatchNowModal = ({ movie, open, onClose, onFinish }) => {
  const { user } = useAuth();

  const [progressPercent, setProgressPercent] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const lastSavedRef = useRef(0);
  const queryClient = useQueryClient();


  /* ============================
     LOAD PROGRESS (ONCE)
  ============================ */
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

         // 🔥 UPDATE CACHE (REMOVE)
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

    // 🔥 UPDATE CACHE (ADD / UPDATE)
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
