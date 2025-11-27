import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCategoryMovies } from '../hooks/useCategoryMovies';
import MovieCard from '../Components/MovieCard';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import {  ThreeDots } from "react-loader-spinner";

const PaginationButton = ({ onClick, disabled, children, variant = 'default' }) => {
  const baseClasses =
    "flex items-center gap-2 px-5 py-2.5 font-semibold rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    default: "bg-pink-900 hover:bg-pink-800 text-white hover:shadow-lg hover:shadow-pink-900/50",
    outline: "border-2 border-pink-900 text-pink-900 hover:bg-pink-900 hover:text-white"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
};

function Category() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useCategoryMovies(type, page);

  const CATEGORY_CONFIG = {
    popular: { title: 'Popular Movies', gradient: 'from-orange-600 to-red-600' },
    top_rated: { title: 'Top Rated Movies', gradient: 'from-yellow-600 to-orange-600' },
    upcoming: { title: 'Upcoming Movies', gradient: 'from-blue-600 to-purple-600' },
    now_playing: { title: 'Trending Now', gradient: 'from-pink-600 to-purple-600' }
  };

  const currentCategory = CATEGORY_CONFIG[type] || CATEGORY_CONFIG.popular;
  const movies = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 500);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



if (isLoading) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
  <ThreeDots 
  height="80"
  width="80"
  color="#9d0341ff"
  visible={true}
/>
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
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              {currentCategory.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-12">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3 flex-wrap">

            <PaginationButton
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <FaArrowLeft /> Previous
            </PaginationButton>

            <div className="hidden sm:flex items-center gap-2">
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
                        ? 'bg-pink-900 text-white shadow-lg shadow-pink-900/50 scale-110'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <PaginationButton
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next <FaArrowRight />
            </PaginationButton>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Category;
