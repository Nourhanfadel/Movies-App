// import React from "react";
// import { useMoviesWithTrailer } from "../hooks/useTrailer";
// import MovieCard from "../Components/MovieCard";
// import { Typewriter } from "react-simple-typewriter";
// import { Link, useNavigate } from "react-router-dom";

// import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowCircleRight, FaArrowLeft, FaArrowRight, FaStar, FaVoteYea } from "react-icons/fa";
// import { TbChartBarPopular } from "react-icons/tb";

// import { useTopRatedMovies } from "../hooks/useTopRatedMovies";
// import { usePopularMovies } from "../hooks/usePopularMovies";
// import { useUpcomingMovies } from "../hooks/useUpcomingMovies";
// import { useTrendingMovies } from "../hooks/useTrendingMovies";
// import { usePopularActors } from "../hooks/usePopularActors";
// import ActorCard from "../Components/ActorCard";
// import { useAuth } from "../context/AuthContext";
// import { useEffect, useState } from "react";
// import ContinueWatchingCard from "../Components/ContinueWatchingCard";
// import { supabase } from "../lib/supabase";
// import { motion, AnimatePresence } from "framer-motion";



// function Home() {

// const { user } = useAuth();
// const navigate = useNavigate();

// const [continueWatching, setContinueWatching] = useState([]);
// const [showModal, setShowModal] = useState(true);

//    const { data: actors, isLoading: loadingActors } = usePopularActors();

//   const { data, isLoading, error } = useMoviesWithTrailer();
//   const { data: popular } = usePopularMovies();
//   const { data: topRated } = useTopRatedMovies();
//   const { data: upcoming } = useUpcomingMovies();
//   const { data: now_playing } = useTrendingMovies();

//    useEffect(() => {
//     const firstVisit = localStorage.getItem("firstVisit");
//     if (!user && !firstVisit) {
//       setShowModal(true);
//     }
//   }, [user]);
  
// useEffect(() => {
//   if (!user) return;

//   const fetchContinueWatching = async () => {
//     const { data, error } = await supabase
//       .from("continue_watching")
//       .select("*")
//       .eq("user_id", user.id)
//       .gt("progress", 0)   // يظهر فقط لو في progress > 0
//       .lt("progress", 100); // ويختفي لو خلص الفيلم

//     if (!error){
//       console.log("Continue watching data:", data);
//       setContinueWatching(data);

//     }

//   };

//   fetchContinueWatching();
// }, [user]);

  

//   if (isLoading || error) {
//     return <p className="text-white p-4">Loading...</p>;
//   }

//   const handleGuest = () => {
//      setShowModal(false);
//      localStorage.setItem("firstVisit", "true"); // لن يظهر مرة أخرى
//    };
   
//     const handleMember = () => {
//      setShowModal(false);
//      localStorage.setItem("firstVisit", "true"); // لن يظهر مرة أخرى
//      navigate("/login");
//    };
   
//   const renderSection = (title, moviesData, type) => {
//     const movies = moviesData?.results || [];

//     if (!movies.length) return null;


//       {/* Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex justify-center items-center bg-black/70"
//           >
           
//             <div className="absolute inset-0 bg-black/60"></div> {/* overlay */}

//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ duration: 0.4 }}
//               className="relative z-10 flex flex-col items-center gap-8"
//             >
//               <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Welcome to MovieApp</h1>
//               <p className="text-white/80 mb-8 text-lg drop-shadow">Choose how you want to continue:</p>

//               <div className="flex gap-8">
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   className="cursor-pointer bg-pink-600/80 hover:bg-pink-500/90 text-white font-bold rounded-2xl w-40 h-40 flex flex-col justify-center items-center shadow-lg transition"
//                   onClick={handleGuest}
//                 >
       
//                   <img src="../../puplic/guest.jpg" alt="guest" className="w-full" />
//                 </motion.div>

//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   className="cursor-pointer bg-blue-600/80 hover:bg-blue-500/90 text-white font-bold rounded-2xl w-40 h-40 flex flex-col justify-center items-center shadow-lg transition"
//                   onClick={handleMember}
//                 >
//                   <span className="text-sm mt-2">Sign In</span> 
//                   <img src="../../puplic/member2.png" alt="member" className="w-full" />
//                 </motion.div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//     return (
//    <div className="w-full h-screen bg-black relative">
    

//       {/* محتوى الصفحة يظهر بعد اختيار Guest */}
//       {!showModal && (

//       <div className="mt-5 pb-8 bg-black">
//         <div className="flex justify-between items-center mb-5 px-4">
//           <h2 className="text-2xl font-bold text-pink-900">{title}</h2>

//           <Link
//             className="text-pink-900 font-semibold text-lg inline-flex items-center gap-1"
//      to={`/category/${type}`}

//           >
//             See More <FaArrowCircleRight />
//           </Link>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4">
//           {movies.slice(0, 6).map((movie) => (
//             <MovieCard key={movie.id} movie={movie} />
//           ))}
//         </div>
//       </div>

//        )}
//     </div>
//     );
//   };

//   const movieOfWeek = data?.movieOfWeek;

//   return (
//     <div className="w-full bg-black">
//       {movieOfWeek && (
//         <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
//           <iframe
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             src={`https://www.youtube.com/embed/${movieOfWeek.trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
//             title={movieOfWeek.title}
//             allow="autoplay; encrypted-media"
//             allowFullScreen
//           ></iframe>

//           <div className="absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center p-6 md:p-12">
//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pink-900 drop-shadow-lg">
//               <Typewriter
//                 words={[movieOfWeek.title]}
//                 loop={false}
//                 cursor
//                 typeSpeed={300}
//                 deleteSpeed={500}
//                 delaySpeed={1000}
//               />
//             </h1>

//             <p className="text-white/80 mt-3 text-sm sm:text-base md:text-base lg:text-lg max-w-2xl drop-shadow">
//               <Typewriter
//                 words={[movieOfWeek.overview]}
//                 loop={1}
//                 cursor
//                 cursorStyle="|"
//                 typeSpeed={50}
//                 deleteSpeed={0}
//                 delaySpeed={500}
//               />
//             </p>

//             <div className="flex items-center gap-6 mt-4 text-pink-900">
//               <div className="flex items-center gap-1 text-lg font-semibold">
//                 <FaStar /> {movieOfWeek.vote_average}
//               </div>

//               <div className="flex items-center gap-1 text-lg font-semibold">
//                 <FaVoteYea /> {movieOfWeek.vote_count}
//               </div>

//               <div className="flex items-center gap-1 text-lg font-semibold">
//                 <TbChartBarPopular /> {movieOfWeek.popularity}
//               </div>
//             </div>

//             <div className="mt-9">
//               <button className="px-6 py-2 bg-pink-900 hover:bg-pink-800 text-white font-semibold rounded-lg transition">
//                 Watch Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
 

// <div className="my-8 px-4">
//   <div className="flex justify-between items-center mb-5">
//     <h2 className="text-2xl font-bold text-pink-900">Top Actors</h2>
//   </div>

//   {loadingActors ? (
//     <p className="text-white">Loading actors...</p>
//   ) : (
//     <div className="relative">
//       <button
//         onClick={() => {
//           const container = document.getElementById('actors-container');
//           container.scrollBy({ left: -300, behavior: 'smooth' });
//         }}
//         className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-pink-900/80 hover:bg-pink-900 text-white p-3 rounded-full shadow-lg"
//       >
//      <FaArrowLeft />
//       </button>

//       <div
//         id="actors-container"
//         className="flex gap-4 overflow-x-auto bg-black p-4 rounded-md scrollbar-hide"
//         style={{
//           scrollbarWidth: 'none',
//           msOverflowStyle: 'none',
//         }}
//       >
//         {actors.map((actor) => (
//           <ActorCard key={actor.id} actor={actor} />
//         ))}
//       </div>

//       <button
//         onClick={() => {
//           const container = document.getElementById('actors-container');
//           container.scrollBy({ left: 300, behavior: 'smooth' });
//         }}
//         className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-pink-900/80 hover:bg-pink-900 text-white p-3 rounded-full shadow-lg"
//       >
// <FaArrowRight />
//       </button>
//     </div>
//   )}
// </div>

//       <div className="w-full bg-black ">
//         {renderSection("Upcoming Movies", upcoming, "upcoming")}
//         {renderSection("Top Rated Movies", topRated, "top_rated")}
//         {renderSection("Popular Movies", popular, "popular")}
//         {renderSection("Trending Now", now_playing, "now_playing")}
//       </div>
//       {continueWatching.length > 0 && (
//   <div className="my-8 px-4 relative">
//     <div className="flex justify-between items-center mb-5">
//       <h2 className="text-2xl font-bold text-pink-900">Continue Watching</h2>
//     </div>

//     <button
//       onClick={() => {
//         const container = document.getElementById("continue-container");
//         container.scrollBy({ left: -300, behavior: "smooth" });
//       }}
//       className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-pink-900/80 hover:bg-pink-900 text-white p-3 rounded-full shadow-lg"
//     >
//       <FaArrowLeft />
//     </button>

//     <div
//       id="continue-container"
//       className="flex gap-4 overflow-x-auto p-4 scrollbar-hide"
//       style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//     >
//       {continueWatching.map((movie) => (
//       <ContinueWatchingCard key={movie.movie_id} movie={movie} />
//       ))}
//     </div>

//     <button
//       onClick={() => {
//         const container = document.getElementById("continue-container");
//         container.scrollBy({ left: 300, behavior: "smooth" });
//       }}
//       className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-pink-900/80 hover:bg-pink-900 text-white p-3 rounded-full shadow-lg"
//     >
//       <FaArrowRight />
//     </button>
//   </div>
// )}

//     </div>
//   );
// }

// export default Home;

// import React, { useEffect, useState } from "react";
// import { useMoviesWithTrailer } from "../hooks/useTrailer";
// import MovieCard from "../Components/MovieCard";
// import { Typewriter } from "react-simple-typewriter";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaArrowLeft,
//   FaArrowRight,
//   FaArrowCircleRight,
//   FaStar,
//   FaVoteYea,
// } from "react-icons/fa";
// import { TbChartBarPopular } from "react-icons/tb";

// import { useTopRatedMovies } from "../hooks/useTopRatedMovies";
// import { usePopularMovies } from "../hooks/usePopularMovies";
// import { useUpcomingMovies } from "../hooks/useUpcomingMovies";
// import { useTrendingMovies } from "../hooks/useTrendingMovies";
// import { usePopularActors } from "../hooks/usePopularActors";
// import ActorCard from "../Components/ActorCard";
// import ContinueWatchingCard from "../Components/ContinueWatchingCard";
// import { useAuth } from "../context/AuthContext";
// import { supabase } from "../lib/supabase";
// import { motion, AnimatePresence } from "framer-motion";

// function Home() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [continueWatching, setContinueWatching] = useState([]);
//   const firstVisit = localStorage.getItem("firstVisit");
//   const [showModal, setShowModal] = useState(!user && !firstVisit);

//   const { data: actors, isLoading: loadingActors } = usePopularActors();
//   const { data, isLoading, error } = useMoviesWithTrailer();
//   const { data: popular } = usePopularMovies();
//   const { data: topRated } = useTopRatedMovies();
//   const { data: upcoming } = useUpcomingMovies();
//   const { data: now_playing } = useTrendingMovies();

//   // fetch continue watching
//   // useEffect(() => {
//   //   if (!user) return;

//   //   const fetchContinueWatching = async () => {
//   //     const { data, error } = await supabase
//   //       .from("continue_watching")
//   //       .select("*")
//   //       .eq("user_id", user.id)
//   //       .gt("progress", 0)
//   //       .lt("progress", 100);

//   //     if (!error) {
//   //       setContinueWatching(data);
//   //     }
//   //   };

//   //   fetchContinueWatching();
//   // }, [user]);
//   // fetch continue watching + real-time updates
// useEffect(() => {
//   if (!user) return;

//   const fetchContinueWatching = async () => {
//     const { data, error } = await supabase
//       .from("continue_watching")
//       .select("*")
//       .eq("user_id", user.id)
//       .gt("progress", 0)
//       .lt("progress", 100);

//     if (!error) {
//       setContinueWatching(data);
//     }
//   };

//   // أول تحميل
//   fetchContinueWatching();

//   // real-time updates
//   const channel = supabase
//     .channel("continue-watching")
//     .on(
//       "postgres_changes",
//       {
//         event: "*",
//         schema: "public",
//         table: "continue_watching",
//         filter: `user_id=eq.${user.id}`,
//       },
//       (payload) => {
//         fetchContinueWatching(); // أي تغيير يحصل → نعمل reload
//       }
//     )
//     .subscribe();

//   return () => {
//     supabase.removeChannel(channel);
//   };
// }, [user]);


//   if (isLoading || error) {
//     return <p className="text-white p-4">Loading...</p>;
//   }

//   const handleGuest = () => {
//     setShowModal(false);
//     localStorage.setItem("firstVisit", "true");
//   };

//   const handleMember = () => {
//     setShowModal(false);
//     localStorage.setItem("firstVisit", "true");
//     navigate("/login");
//   };

//   const renderSection = (title, moviesData, type) => {
//     const movies = moviesData?.results || [];

//     if (!movies.length || showModal) return null; // hide until modal closes

//     return (
//       <div className="mt-5 pb-8 bg-black">
//         <div className="flex justify-between items-center mb-5 px-4">
//           <h2 className="text-2xl font-bold text-pink-900">{title}</h2>

//           <Link
//             className="text-pink-900 font-semibold text-lg inline-flex items-center gap-1"
//             to={`/category/${type}`}
//           >
//             See More <FaArrowCircleRight />
//           </Link>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4">
//           {movies.slice(0, 6).map((movie) => (
//             <MovieCard key={movie.id} movie={movie} />
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const movieOfWeek = data?.movieOfWeek;

//   return (
//     <div className="w-full bg-black">

//       {/* -------------- Modal (Only once) -------------- */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex justify-center items-center bg-black/70"
//           >
//             <div className="absolute inset-0 bg-black/60"></div>

//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ duration: 0.4 }}
//               className="relative z-10 flex flex-col items-center gap-8"
//             >
//               <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
//                 Welcome to MovieApp
//               </h1>
//               <p className="text-white/80 mb-8 text-lg drop-shadow">
//                 Choose how you want to continue:
//               </p>

//               <div className="flex gap-8">
//                 {/* Guest */}
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   className="cursor-pointer bg-pink-600/80 hover:bg-pink-500/90 text-white font-bold rounded-2xl w-40 h-40 flex justify-center items-center shadow-lg"
//                   onClick={handleGuest}
//                 >
//                   <img src="/guest.jpg" className="w-full h-full rounded-2xl" />
//                 </motion.div>

//                 {/* Member */}
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   className="cursor-pointer bg-blue-600/80 hover:bg-blue-500/90 text-white font-bold rounded-2xl w-40 h-40 flex justify-center items-center shadow-lg"
//                   onClick={handleMember}
//                 >
//                   <img src="/member2.png" className="w-full h-full rounded-2xl" />
//                 </motion.div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ---------------- HERO ---------------- */}
//       {!showModal && movieOfWeek && (
//         <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
//           <iframe
//             className="absolute top-0 left-0 w-full h-full object-cover"
//             src={`https://www.youtube.com/embed/${movieOfWeek.trailerKey}?autoplay=1&mute=1&controls=0`}
//             title={movieOfWeek.title}
//             allow="autoplay; encrypted-media"
//             allowFullScreen
//           ></iframe>

//           <div className="absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center p-6 md:p-12">
//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pink-900 drop-shadow-lg">
//               <Typewriter
//                 words={[movieOfWeek.title]}
//                 loop={false}
//                 cursor
//                 typeSpeed={300}
//               />
//             </h1>

//             <p className="text-white/80 mt-3 text-lg max-w-2xl drop-shadow">
//               <Typewriter
//                 words={[movieOfWeek.overview]}
//                 loop={1}
//                 cursor
//                 typeSpeed={40}
//               />
//             </p>
//           </div>
//         </div>
//       )}

//       {/* ---------------- Actors ---------------- */}
//       {!showModal && (
//       <div className="my-8 px-4">
//   <div className="flex justify-between items-center mb-5">
//     <h2 className="text-2xl font-bold text-pink-900">Top Actors</h2>
//   </div>

//   {loadingActors ? (
//     <p className="text-white">Loading actors...</p>
//   ) : (
//     <div className="relative">
//       <button
//         onClick={() => {
//           const container = document.getElementById('actors-container');
//           container.scrollBy({ left: -300, behavior: 'smooth' });
//         }}
//         className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-pink-900/80 hover:bg-pink-900 text-white p-3 rounded-full shadow-lg"
//       >
//      <FaArrowLeft />
//       </button>

//       <div
//         id="actors-container"
//         className="flex gap-4 overflow-x-auto bg-black p-4 rounded-md scrollbar-hide"
//         style={{
//           scrollbarWidth: 'none',
//           msOverflowStyle: 'none',
//         }}
//       >
//         {actors.map((actor) => (
//           <ActorCard key={actor.id} actor={actor} />
//         ))}
//       </div>

//       <button
//         onClick={() => {
//           const container = document.getElementById('actors-container');
//           container.scrollBy({ left: 300, behavior: 'smooth' });
//         }}
//         className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-pink-900/80 hover:bg-pink-900 text-white p-3 rounded-full shadow-lg"
//       >
// <FaArrowRight />
//       </button>
//     </div>
//   )}
// </div>
//       )}

//       {/* ----------- Sections ----------- */}
//       {!showModal && (
//         <>
//           {renderSection("Upcoming Movies", upcoming, "upcoming")}
//           {renderSection("Top Rated Movies", topRated, "top_rated")}
//           {renderSection("Popular Movies", popular, "popular")}
//           {renderSection("Trending Now", now_playing, "now_playing")}
//         </>
//       )}

//       {/* ----------- Continue Watching ----------- */}
//       {!showModal && continueWatching.length > 0 && (
//         <div className="my-8 px-4">
//           <h2 className="text-2xl font-bold text-pink-900 mb-5">
//             Continue Watching
//           </h2>

//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//             {continueWatching.map((item) => (
//             <ContinueWatchingCard key={item.id} movie={item} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Home;

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMoviesWithTrailer } from "../hooks/useTrailer";
import { usePopularActors } from "../hooks/usePopularActors";

import { usePopularMovies } from "../hooks/usePopularMovies";
import { useTopRatedMovies } from "../hooks/useTopRatedMovies";
import { useUpcomingMovies } from "../hooks/useUpcomingMovies";
import { useTrendingMovies } from "../hooks/useTrendingMovies";
import { useContinueWatching } from "../hooks/useContinueWatching";

import MovieSection from "../Components/MovieSection";
import ActorsSlider from "../Components/ActorsSlider";
import ContinueWatchingCard from "../Components/ContinueWatchingCard";
import { Typewriter } from "react-simple-typewriter";
import WatchNowModal from "../Components/WatchNowModal";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdEmojiPeople } from "react-icons/md";


export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  
  const { data: actors } = usePopularActors();
  const { data, isLoading } = useMoviesWithTrailer();
  
  const { data: popular } = usePopularMovies();
  const { data: topRated } = useTopRatedMovies();
  const { data: upcoming } = useUpcomingMovies();
  const { data: trending } = useTrendingMovies();
  
const continueWatching = useContinueWatching(user?.id);
  
  const [showModal, setShowModal] = useState(
     !user && !localStorage.getItem("firstVisit")
   );
  const movieOfWeek = data?.movieOfWeek;

    const sliderRef = useRef(null);


  useEffect(() => {
  console.log("USER FROM AUTH =", user);
}, [user]);


   useEffect(() => {
    const firstVisit = localStorage.getItem("firstVisit");
    if (!user && !firstVisit) {
      setShowModal(true);
    }
  }, [user]);



  
  const handleGuest = () => {
    setShowModal(false);
    localStorage.setItem("firstVisit", "true");
  };

  const handleMember = () => {
    setShowModal(false);
    localStorage.setItem("firstVisit", "true");
    navigate("/login");
  };

  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleContinueWatchingClick = async (item) => {
  // جلب بيانات الفيلم الكامل من الـ API
  const fullMovie = data?.allMovies?.find(m => m.id === item.movie_id) || item;
  setSelectedMovie({ ...fullMovie, progress: item.progress });
};

 const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };




  if (isLoading) return <p className="text-white">Loading...</p>;

  return (
    <div className="w-full bg-black">






             {/* -------------- Modal (Only once) -------------- */}
       <AnimatePresence>
         {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/70"
          >
            <div className="absolute inset-0 bg-black/60"></div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex flex-col items-center gap-8"
            >
              <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                Welcome to MovieApp
              </h1>
              <p className="text-white/80 mb-8 text-lg drop-shadow">
                Choose how you want to continue:
              </p>

              <div className="flex gap-8">
                {/* Guest */}
                <div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer bg-pink-600/80 hover:bg-pink-500/90 text-white font-bold rounded-2xl w-40 h-40 flex  justify-center items-center shadow-lg"
                  onClick={handleGuest}
                >
                  {/* <img src="/guest.jpg" className="w-full h-full rounded-2xl" /> */}
                  <MdEmojiPeople className="w-7xl h-40" />
                </motion.div>
                <h6 className="text-2xl text-white text-center">Guest</h6>
                </div>

                {/* Member */}
                <div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer bg-blue-600/80 hover:bg-blue-500/90 text-white font-bold rounded-2xl w-40 h-40 flex justify-center items-center shadow-lg"
                  onClick={handleMember}
                >
                  <FaPeopleGroup className="w-7xl h-40" />
                </motion.div>
                <h6 className="text-2xl text-white text-center">Member</h6>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>









       {!showModal && movieOfWeek && (
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={`https://www.youtube.com/embed/${movieOfWeek.trailerKey}?autoplay=1&mute=1&controls=0`}
            title={movieOfWeek.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>

          <div className="absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center p-6 md:p-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pink-900 drop-shadow-lg">
              <Typewriter
                words={[movieOfWeek.title]}
                loop={false}
                cursor
                typeSpeed={300}
              />
            </h1>

            <p className="text-white/80 mt-3 text-lg max-w-2xl drop-shadow">
              <Typewriter
                words={[movieOfWeek.overview]}
                loop={1}
                cursor
                typeSpeed={40}
              />
            </p>
          </div>
        </div>
      )}


      {!showModal && actors && <ActorsSlider actors={actors} />}

      {!showModal && (
        <>
          <MovieSection title="Upcoming Movies" data={upcoming} type="upcoming" />
          <MovieSection title="Top Rated Movies" data={topRated} type="top_rated" />
          <MovieSection title="Popular Movies" data={popular} type="popular" />
          <MovieSection title="Trending Now" data={trending} type="now_playing" />
        </>
      )}

      {/* {!showModal && continueWatching.length > 0 && (
        <div className="my-8 px-4">
          <h2 className="text-2xl font-bold text-pink-900 mb-5">
            Continue Watching
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {continueWatching.map(movie => (
  <ContinueWatchingCard key={movie.movie_id} movie={movie} />
))}
          </div>
        </div>
      )} */}

      
      {/* Continue Watching Slider */}
      {continueWatching.length > 0 && (
        <div className="relative my-8 px-4">
          <h2 className="text-2xl font-bold text-pink-900 mb-4">Continue Watching</h2>

          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 not-first: p-2 rounded-full"
          >
            <FaArrowLeft className="text-pink-900  bg-transparent" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full"
          >
            <FaArrowRight className="text-pink-900  bg-transparent"/>
          </button>

          <div
            ref={sliderRef}
            className="flex overflow-x-hidden overflow-y-hidden scrollbar-hide gap-4 scroll-smooth"
          >
            {continueWatching.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-40 sm:w-48 md:w-56">
                <ContinueWatchingCard
                  movie={item}
                  onClick={() => handleContinueWatchingClick(item)}
                />
              </div>
            ))}
          </div>
        </div>
      )}


      {selectedMovie && (
        <WatchNowModal
          movie={selectedMovie}
          open={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

    </div>
  );
}
