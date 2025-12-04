import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MovieCard from "../Components/MovieCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useGenres, useMoviesByGenre } from "../hooks/useGeners";

const PaginationButton = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-2 px-5 py-2.5 font-semibold rounded-lg transition-all duration-300
               bg-pink-900 hover:bg-pink-800 text-white disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

const GenrePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);


  const { data: allGenres = [], isLoading: genresLoading } = useGenres();
  const genre = allGenres.find((g) => g.id === parseInt(id));
  const genreName = genre?.name || "Genre Movies";

  const { data: moviesData, isLoading: moviesLoading, error } = useMoviesByGenre(id, page);

  const movies = moviesData?.results || [];
  const totalPages = Math.min(moviesData?.total_pages || 1, 500);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (moviesLoading || genresLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ThreeDots height="80" width="80" color="#9d0341ff" visible={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error.message}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-pink-900 hover:bg-pink-800 text-white font-semibold rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
  
      <div className="py-12 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
            {genreName}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {movies.length === 0 ? (
          <p className="text-white text-lg">No movies found in this genre.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-12">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {movies.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <PaginationButton onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                <FaArrowLeft /> Previous
              </PaginationButton>

              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;

                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                      page === pageNum
                        ? "bg-pink-900 text-white shadow-lg shadow-pink-900/50 scale-110"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <PaginationButton onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                Next <FaArrowRight />
              </PaginationButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenrePage;
