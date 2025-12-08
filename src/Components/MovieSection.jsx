import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import { FaArrowCircleRight } from "react-icons/fa";

export default function MovieSection({ title, data, type }) {
  if (!data?.results?.length) return null;

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
        {data.results.slice(0, 6).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
