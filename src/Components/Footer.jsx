import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-black text-white py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        

        <div className="text-2xl font-bold text-pink-900 font-montserrat cursor-pointer">
          HENO
        </div>


        <div className="flex flex-wrap gap-6 text-gray-300 text-sm">
          <Link className="hover:text-white transition">Home</Link>
          <Link to="/movies" className="hover:text-white transition">Movies</Link>
          <Link to="/genres" className="hover:text-white transition">Genres</Link>

        </div>

        <div className="flex gap-4 text-xl">
          <a href="#" className="hover:text-pink-800 transition"><FaFacebookF /></a>
          <a href="#" className="hover:text-pink-800 transition"><FaTwitter /></a>
          <a href="#" className="hover:text-pink-800 transition"><FaInstagram /></a>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} HENO. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
