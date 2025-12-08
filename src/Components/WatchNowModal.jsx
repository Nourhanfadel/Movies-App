// import { useEffect, useRef, useState } from "react";
// import { FaTimes } from "react-icons/fa";
// import { supabase } from "../lib/supabase";
// import { useAuth } from "../context/AuthContext";

// const WatchNowModal = ({ movie, open, onClose }) => {
//   const { user } = useAuth();

//   const [startFrom, setStartFrom] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [videoDuration, setVideoDuration] = useState(0);

//   const playerRef = useRef(null);
//   const intervalRef = useRef(null);

//   /** ============================
//    *  LOAD PROGRESS FROM SUPABASE
//    * ============================ */
//   useEffect(() => {
//     if (!user || !movie?.id) return;

//     const loadProgress = async () => {
//       const { data, error } = await supabase
//         .from("continue_watching")
//         .select("progress")
//         .eq("user_id", user.id)
//         .eq("movie_id", movie.id)
//         .maybeSingle();

//       if (data?.progress) {
//         const seconds = (data.progress / 100) * (movie.runtime * 60);
//         setStartFrom(Math.floor(seconds));
//       }
//     };

//     loadProgress();
//   }, [movie, user]);

//   /** ============================
//    *  YOUTUBE PLAYER INIT
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

//       new window.YT.Player("card-player", {
//         videoId: trailer.key,
//         playerVars: {
//           autoplay: 1,
//           controls: 1,
//           start: Math.floor(startFrom),
//         },
//         events: {
//           onReady: (event) => {
//             playerRef.current = event.target;

//             const duration = event.target.getDuration();
//             if (duration) setVideoDuration(duration);

//             intervalRef.current = setInterval(() => {
//               if (playerRef.current) {
//                 const t = playerRef.current.getCurrentTime();
//                 setCurrentTime(t);
//               }
//             }, 3000);
//           },
//         },
//       });
//     };

//     initPlayer();

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [open, movie, startFrom]);

//   /** ============================
//    *  SAVE PROGRESS TO SUPABASE
//    * ============================ */
//   useEffect(() => {
//     if (!user || currentTime < 5) return;

//     const saveProgress = async () => {
//       const duration =
//         videoDuration || movie?.runtime * 60 || currentTime * 3;

//       const percentage = Math.min((currentTime / duration) * 100, 100);

//       await supabase.from("continue_watching").upsert(
//         {
//           user_id: user.id,
//           movie_id: movie.id,
//           progress: percentage,
//         },
//         { onConflict: "user_id, movie_id" }
//       );
//     };

//     saveProgress();
//   }, [currentTime]);

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

const WatchNowModal = ({ movie, open, onClose }) => {
  const { user } = useAuth();

  const [startFrom, setStartFrom] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  /** ============================
   * LOAD PROGRESS FROM SUPABASE
   * ============================ */
  useEffect(() => {
    if (!user || !movie?.id) return;

    const loadProgress = async () => {
      const { data } = await supabase
        .from("continue_watching")
        .select("progress")
        .eq("user_id", user.id)
        .eq("movie_id", movie.id)
        .maybeSingle();

      if (data?.progress) {
        const seconds = (data.progress / 100) * (movie.runtime * 60);
        setStartFrom(Math.floor(seconds));
      }
    };

    loadProgress();
  }, [movie, user]);

  /** ============================
   * YOUTUBE PLAYER INIT
   * ============================ */
  useEffect(() => {
    if (!open) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

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
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (!trailer) return;

      new window.YT.Player("card-player", {
        videoId: trailer.key,
        playerVars: {
          autoplay: 1,
          controls: 1,
          start: Math.floor(startFrom),
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;

            const duration = event.target.getDuration();
            if (duration) setVideoDuration(duration);

            intervalRef.current = setInterval(() => {
              if (playerRef.current) {
                const t = playerRef.current.getCurrentTime();
                setCurrentTime(t);
              }
            }, 3000);
          },
        },
      });
    };

    initPlayer();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [open, movie, startFrom]);

  /** ============================
   * SAVE PROGRESS TO SUPABASE
   * ============================ */
 useEffect(() => {
  if (!user || currentTime < 5) return;

  const saveProgress = async () => {
    const duration = videoDuration || movie?.runtime * 60 || currentTime * 3;
    const percentage = Math.min((currentTime / duration) * 100, 100);

    if (percentage >= 95) {
      // احذف الفيلم من continue watching لو اكتر من 95%
      await supabase
        .from("continue_watching")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movie.id);
    } else {
      await supabase.from("continue_watching").upsert(
        {
          user_id: user.id,
          movie_id: movie.id,
          progress: percentage,
        },
        { onConflict: "user_id, movie_id" }
      );
    }
  };

  saveProgress();
}, [currentTime]);



  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
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

