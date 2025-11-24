import React from 'react'
import { useMovies } from '../hooks/useMovies';
import MovieCard from '../Components/MovieCard';

function Home() {
 const {data, isLoading, error}=useMovies();

 console.log(data);

     if (isLoading) return <p className="text-white">Loading...</p>;
     if (error) return <p className="text-red-500">Error fetching movies.</p>;

  return (
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 p-4">
      {data.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
        
      ))}
    </div>  )
}

export default Home