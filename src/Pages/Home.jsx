import React from "react";
import { useMoviesWithTrailer } from "../hooks/useTrailer";
import MovieCard from "../Components/MovieCard";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";

import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowCircleRight, FaArrowLeft, FaArrowRight, FaStar, FaVoteYea } from "react-icons/fa";
import { TbChartBarPopular } from "react-icons/tb";

import { useTopRatedMovies } from "../hooks/useTopRatedMovies";
import { usePopularMovies } from "../hooks/usePopularMovies";
import { useUpcomingMovies } from "../hooks/useUpcomingMovies";
import { useTrendingMovies } from "../hooks/useTrendingMovies";
import { usePopularActors } from "../hooks/usePopularActors";
import ActorCard from "../Components/ActorCard";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import ContinueWatchingCard from "../Components/ContinueWatchingCard";
import { supabase } from "../lib/supabase";


function Home() {

const { user } = useAuth();
const [continueWatching, setContinueWatching] = useState([]);



   const { data: actors, isLoading: loadingActors } = usePopularActors();

  const { data, isLoading, error } = useMoviesWithTrailer();
  const { data: popular } = usePopularMovies();
  const { data: topRated } = useTopRatedMovies();
  const { data: upcoming } = useUpcomingMovies();
  const { data: now_playing } = useTrendingMovies();

  
useEffect(() => {
  if (!user) return;

  const fetchContinueWatching = async () => {
    const { data, error } = await supabase
      .from("continue_watching")
      .select("*")
      .eq("user_id", user.id)
      .gt("progress", 0)   // يظهر فقط لو في progress > 0
      .lt("progress", 100); // ويختفي لو خلص الفيلم

    if (!error){
      console.log("Continue watching data:", data);
      setContinueWatching(data);

    }

  };

  fetchContinueWatching();
}, [user]);

  

  if (isLoading || error) {
    return <p className="text-white p-4">Loading...</p>;
  }

  const renderSection = (title, moviesData, type) => {
    const movies = moviesData?.results || [];

    if (!movies.length) return null;

    return (
      <div className="mt-5 pb-8 bg-black">
        <div className="flex justify-between items-center mb-5 px-4">
          <h2 className="text-2xl font-bold text-pink-900">{title}</h2>

          <Link
            className="text-pink-900 font-semibold text-lg inline-flex items-center gap-1"
     to={`/category/${type}`}

          >
            See More <FaArrowCircleRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4">
          {movies.slice(0, 6).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    );
  };

  const movieOfWeek = data?.movieOfWeek;

  return (
    <div className="w-full bg-black">
      {movieOfWeek && (
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={`https://www.youtube.com/embed/${movieOfWeek.trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
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
                deleteSpeed={500}
                delaySpeed={1000}
              />
            </h1>

            <p className="text-white/80 mt-3 text-sm sm:text-base md:text-base lg:text-lg max-w-2xl drop-shadow">
              <Typewriter
                words={[movieOfWeek.overview]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={50}
                deleteSpeed={0}
                delaySpeed={500}
              />
            </p>

            <div className="flex items-center gap-6 mt-4 text-pink-900">
              <div className="flex items-center gap-1 text-lg font-semibold">
                <FaStar /> {movieOfWeek.vote_average}
              </div>

              <div className="flex items-center gap-1 text-lg font-semibold">
                <FaVoteYea /> {movieOfWeek.vote_count}
              </div>

              <div className="flex items-center gap-1 text-lg font-semibold">
                <TbChartBarPopular /> {movieOfWeek.popularity}
              </div>
            </div>

            <div className="mt-9">
              <button className="px-6 py-2 bg-pink-900 hover:bg-pink-800 text-white font-semibold rounded-lg transition">
                Watch Now
              </button>
            </div>
          </div>
        </div>
      )}
 

<div className="my-8 px-4">
  <div className="flex justify-between items-center mb-5">
    <h2 className="text-2xl font-bold text-pink-900">Top Actors</h2>
  </div>

  {loadingActors ? (
    <p className="text-white">Loading actors...</p>
  ) : (
    <div className="relative">
      <button
        onClick={() => {
          const container = document.getElementById('actors-container');
          container.scrollBy({ left: -300, behavior: 'smooth' });
        }}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-pink-900/80 hover:bg-pink-900 text-white p-3 rounded-full shadow-lg"
      >
     <FaArrowLeft />
      </button>

      <div
        id="actors-container"
        className="flex gap-4 overflow-x-auto bg-black p-4 rounded-md scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {actors.map((actor) => (
          <ActorCard key={actor.id} actor={actor} />
        ))}
      </div>

      <button
        onClick={() => {
          const container = document.getElementById('actors-container');
          container.scrollBy({ left: 300, behavior: 'smooth' });
        }}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-pink-900/80 hover:bg-pink-900 text-white p-3 rounded-full shadow-lg"
      >
<FaArrowRight />
      </button>
    </div>
  )}
</div>

      <div className="w-full bg-black ">
        {renderSection("Upcoming Movies", upcoming, "upcoming")}
        {renderSection("Top Rated Movies", topRated, "top_rated")}
        {renderSection("Popular Movies", popular, "popular")}
        {renderSection("Trending Now", now_playing, "now_playing")}
      </div>
      {continueWatching.length > 0 && (
  <div className="my-8 px-4 relative">
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-2xl font-bold text-pink-900">Continue Watching</h2>
    </div>

    <button
      onClick={() => {
        const container = document.getElementById("continue-container");
        container.scrollBy({ left: -300, behavior: "smooth" });
      }}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-pink-900/80 hover:bg-pink-900 text-white p-3 rounded-full shadow-lg"
    >
      <FaArrowLeft />
    </button>

    <div
      id="continue-container"
      className="flex gap-4 overflow-x-auto p-4 scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {continueWatching.map((movie) => (
      <ContinueWatchingCard key={movie.movie_id} movie={movie} />
      ))}
    </div>

    <button
      onClick={() => {
        const container = document.getElementById("continue-container");
        container.scrollBy({ left: 300, behavior: "smooth" });
      }}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-pink-900/80 hover:bg-pink-900 text-white p-3 rounded-full shadow-lg"
    >
      <FaArrowRight />
    </button>
  </div>
)}

    </div>
  );
}

export default Home;
