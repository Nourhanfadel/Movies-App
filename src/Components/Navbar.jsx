import React, { useState } from "react";
import {
  FaFistRaised,
  FaDragon,
  FaLaugh,
  FaUserSecret,
  FaFilm,
  FaTheaterMasks,
  FaUsers,
  FaHatWizard,
  FaHistory,
  FaGhost,
  FaMusic,
  FaSearch,
  FaHeart,
  FaRobot,
  FaTv,
  FaStar,
  FaGlobe,
  FaFireAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaFire,
  FaClock,
  FaTrophy,
  FaChartLine,
  FaListUl,
  FaPlay,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useFavoriteMovies } from "../hooks/useFavoriteMovies";
import { useGenres } from "../hooks/useGeners";
import { useWatchlist } from "../hooks/useWatchlist";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

function Navbar() {
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const { user, signOut } = useAuth();

  const { data: favorites } = useFavoriteMovies();
  const { data: genres = [], isLoading: genresLoading } = useGenres();
  const { data: watchlist } = useWatchlist();

  const favoritesCount = favorites?.length || 0;
  const watchlistCount = watchlist?.length || 0;

  const displayName = user?.email
    ? user.email.split("@")[0].slice(0, 4)
    : "Guest";

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?query=${encodeURIComponent(search.trim())}`);
    setIsSidebarOpen(false);
  };

  const handleGenreClick = (id) => {
    navigate(`/genre/${id}`);
    setIsSidebarOpen(false);
  };

  const handleCategoryClick = (type) => {
    navigate(`/category/${type}`);
    setIsSidebarOpen(false);
  };

  const genreIcons = {
    Action: <FaFistRaised />,
    Adventure: <FaDragon />,
    Animation: <FaHatWizard />,
    Comedy: <FaLaugh />,
    Crime: <FaUserSecret />,
    Documentary: <FaFilm />,
    Drama: <FaTheaterMasks />,
    Family: <FaUsers />,
    Fantasy: <FaHatWizard />,
    History: <FaHistory />,
    Horror: <FaGhost />,
    Music: <FaMusic />,
    Mystery: <FaUserSecret />,
    Romance: <FaHeart />,
    "Science Fiction": <FaRobot />,
    Thriller: <FaStar />,
    War: <FaFireAlt />,
    Western: <FaGlobe />,
    "TV Movie": <FaTv />,
  };

  const categories = [
    { name: "Popular", type: "popular", icon: <FaFire /> },
    { name: "Top Rated", type: "top_rated", icon: <FaTrophy /> },
    { name: "Upcoming", type: "upcoming", icon: <FaClock /> },
    { name: "Now Playing", type: "now_playing", icon: <FaChartLine /> },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="w-full bg-black text-white shadow-md px-6 py-4 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-2xl hover:text-pink-500 transition"
          >
            <FaBars />
          </button>

          <Link to="/">
            <div className="text-3xl font-extrabold font-serif text-pink-900">
              Movies
            </div>
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex items-center bg-gray-300 rounded-xl overflow-hidden flex-grow max-w-md mx-4"
        >
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-2 outline-none text-black"
          />
          <button type="submit" className="px-5 text-pink-900">
            <FaSearch />
          </button>
        </form>

        <div className="flex items-center gap-6">
          <div className="relative">
            <Link to="/favorites">
              <FaHeart className="text-2xl hover:text-pink-500 transition" />
            </Link>
            {favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {favoritesCount}
              </span>
            )}
          </div>

          <div className="relative">
            <Link to="/watchlist">
              <FaListUl className="text-2xl hover:text-pink-500 transition" />
            </Link>
            {watchlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {watchlistCount}
              </span>
            )}
          </div>

          <span className="text-sm text-gray-300">Hi {displayName}</span>

          {user ? (
            <button
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
              className="px-4 py-1 rounded-lg bg-pink-600 hover:bg-pink-700 text-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1 rounded-lg bg-pink-600 hover:bg-pink-700 text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}


      <div
        className={`fixed top-0 left-0 h-full w-3/4 sm:w-2/5 md:w-72
        bg-gradient-to-b from-gray-900 to-black text-white shadow-2xl z-50
        transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >

        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-pink-500">Menu</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-2xl hover:text-pink-500 transition"
          >
            <FaTimes />
          </button>
        </div>


<div className="overflow-y-auto h-[calc(100vh-88px)] p-4 scrollbar-hide">
 
          <Link
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pink-900/40 transition text-lg font-semibold mb-4"
          >
            <FaHome className="text-xl" />
            <span>Home</span>
          </Link>

          {/* Categories */}
          <div className="mb-6 border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-pink-400 mb-3 px-4">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.type}>
                  <button
                    onClick={() => handleCategoryClick(category.type)}
                    className="w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg hover:bg-pink-900 hover:bg-opacity-30 transition"
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-pink-400 mb-3 px-4">
              Genres
            </h3>
            {genresLoading ? (
              <div className="px-4">
                <Loader />
              </div>
            ) : genres.length > 0 ? (
              <ul className="space-y-2">
                {genres.map((genre) => (
                  <li key={genre.id}>
                    <button
                      onClick={() => handleGenreClick(genre.id)}
                      className="w-full flex items-center gap-3 text-left px-4 py-2 rounded-lg hover:bg-pink-900 hover:bg-opacity-30 transition"
                    >
                      <span className="text-xl">
                        {genreIcons[genre.name] || <FaPlay />}
                      </span>
                      <span>{genre.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 px-4">No genres available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;