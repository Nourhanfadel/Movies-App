import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() === "") return;
    // انتقل لصفحة البحث مع query
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

      <div className="flex items-center gap-4 text-2xl flex-shrink-0"></div>
    </nav>
  );
}

export default Navbar;
