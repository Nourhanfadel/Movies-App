import React, { useState } from "react";
import { FaHeart, FaSearch } from "react-icons/fa";
import { GrFavorite } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { useFavoriteMovies } from "../hooks/useFavoriteMovies";

function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
    const { data: favorites } = useFavoriteMovies();
    const favoritesCount = favorites?.length || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === "") return;
    navigate(`/search?query=${encodeURIComponent(search.trim())}`);
  };

  return (
    <nav className="w-full bg-black text-white shadow-md px-6 py-4 flex items-center justify-between">
      <div className="text-3xl font-extrabold cursor-pointer font-serif flex-shrink-0 text-pink-900 drop-shadow-lg tracking-wide">
        HENO
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
        <button type="submit" className="px-5 text-pink-900 hover:text-pink-800">
          <FaSearch />
        </button>
      </form>

     <div className="relative cursor-pointer">
      <Link to="/favorites">
      <FaHeart className="text-2xl text-white hover:text-pink-500 transition" />
</Link>
      {favoritesCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
          {favoritesCount}
        </span>
      )}
    </div>
    </nav>
  );
}

export default Navbar;
