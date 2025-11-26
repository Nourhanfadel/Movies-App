// GenrePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieCard from "../Components/MovieCard";


const API_KEY = "707a6ad42842c1872f886101e63e0c78";
const BASE_URL = "https://api.themoviedb.org/3";

const GenrePage = () => {
  const { id } = useParams(); // هيمسك genre id من الرابط
  const [movies, setMovies] = useState([]);
  const [genreName, setGenreName] = useState("");

  useEffect(() => {
    // جلب اسم النوع (genre)
    fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
      .then((res) => res.json())
      .then((data) => {
        const genre = data.genres.find((g) => g.id === parseInt(id));
        setGenreName(genre?.name || "Unknown Genre");
      });

    // جلب الأفلام لهذا النوع
    fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${id}`)
      .then((res) => res.json())
      .then((data) => setMovies(data.results));
  }, [id]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">{genreName}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default GenrePage;
