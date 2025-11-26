import React from "react";
import { useMoviesWithTrailer } from "../hooks/useTrailer";
import MovieCard from "../Components/MovieCard";
import { Typewriter } from "react-simple-typewriter";
import { Link, useNavigate } from "react-router-dom";
import { usePopularMovies, useTopRatedMovies, useTrendingMovies, useUpcomingMovies } from "../hooks/useMovies";
import { FaArrowCircleRight, FaStar, FaVoteYea } from "react-icons/fa";
import { TbChartBarPopular } from "react-icons/tb";

function Home() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useMoviesWithTrailer();

  const { data: topRatedData, isLoading: loadingTopRated } = useTopRatedMovies();
  const { data: upcomingData, isLoading: loadingUpcoming } = useUpcomingMovies();
  const { data: trendingData, isLoading: loadingTrending } = useTrendingMovies();
  const { data: popularData, isLoading: loadingPopular } = usePopularMovies();

  if (loadingPopular || loadingTopRated || loadingUpcoming || loadingTrending || isLoading || error) {
    return <p className="text-white p-4">Loading...</p>;
  }


  const upcomingMovies = upcomingData?.results || [];
  const trendingMovies = trendingData?.results || [];
  const topRatedMovies = topRatedData?.results || [];
  const popularMovies = popularData?.results || [];


  const renderSection = (title, movies, type) => (
    <div className="my-8">
      <div className="flex justify-between items-center mb-5 px-4">
        <h2 className="text-2xl font-bold text-rose-800">{title}</h2>
      <Link
  className="text-rose-800 font-semibold text-lg inline-flex items-center gap-1"
  onClick={() => navigate(`/movies/${type}`)}
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


  const movieOfWeek = data?.movieOfWeek;

  return (
    <div className="w-full">
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-rose-800 drop-shadow-lg">
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
                cursor={true}
                cursorStyle="|"
                typeSpeed={50}
                deleteSpeed={0}
                delaySpeed={500}
              />
            </p>

<div className="flex items-center gap-6 mt-4 text-rose-800">
  <div className="flex items-center gap-1 text-lg font-semibold">
    <FaStar /> {movieOfWeek.vote_average}
  </div>
  <div className="flex items-center gap-1 text-lg font-semibold"><FaVoteYea /> {movieOfWeek.vote_count}</div>
  <div className="flex items-center gap-1 text-lg font-semibold"><TbChartBarPopular /> {movieOfWeek.popularity}</div>
</div>

            <div className="mt-9">
              <button className="px-6 py-2 bg-rose-800 hover:bg-rose-700 text-white font-semibold rounded-lg transition">
                Watch Now
              </button>
            </div>
          </div>
        </div>
      )}

       <div className="w-full">
      {renderSection("Upcoming Movies", upcomingMovies, "upcoming")}
      {renderSection("Top Rated Movies", topRatedMovies, "top_rated")}
      {renderSection("Popular Movies", popularMovies, "popular")}
      {renderSection("Trending Now", trendingMovies, "now_playing")}
    </div>
    </div>
  );
}

export default Home;
