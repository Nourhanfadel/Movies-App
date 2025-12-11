import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";
import { FaArrowCircleRight } from "react-icons/fa";

const MoviesSlider = ({ 
  movies, 
  title, 
  icon, 
  seeMoreLink,
  autoplay = true 
}) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pb-8 bg-black">
      <div className="flex justify-between items-center mb-5 px-4">
        <div className="flex items-center gap-3">
          {icon && <span className="text-3xl">{icon}</span>}
          <h2 className="text-2xl font-bold text-pink-900">{title}</h2>
        </div>

        {seeMoreLink && (
          <Link
            to={seeMoreLink}
            className="text-pink-900 font-semibold text-lg inline-flex items-center gap-2 hover:text-pink-700 transition"
          >
            See More <FaArrowCircleRight />
          </Link>
        )}
      </div>

      <div className="px-4">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          navigation
          pagination={{ clickable: true }}
          autoplay={autoplay ? {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          } : false}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="movies-swiper"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <MovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default MoviesSlider;