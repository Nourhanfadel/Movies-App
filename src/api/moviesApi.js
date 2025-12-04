import { tmbd } from "./tmdb";

export const getPopularMovies= async () =>{
    const res = await tmbd.get("/movie/popular");
    return res.data.results;
}

export const getMovieDetails = async (movieId) => {
    const res = await tmbd.get(`/movie/${movieId}`, {
        params: {
            append_to_response: "videos,credits,reviews,similar"
        }
    });
    return res.data;
}


export const getMovieTrailer = async (movieId) => {
  const res = await tmbd.get(`/movie/${movieId}`,{
    params: {
      append_to_response: "videos"}
  }
  );
  return res.data.results;
};

export const fetchSearchMovies = async ({ pageParam = 1, queryKey }) => {
  const [_key, searchTerm] = queryKey;
  if (!searchTerm) return { results: [], total_pages: 0, page: 1 };
  const res = await tmbd.get("/search/movie", {
    params: { query: searchTerm, page: pageParam },
  });
  return res.data;
};


export const fetchMovies = async (category) => {
  const { data } = await tmbd.get(`/movie/${category}`, {
    params: {
      language: "en-US",
      page: 1,
    },
  });
  return data;
};

// export const fetchCategoryMovies = async (id) => {
//   const { data } = await tmbd.get(`/movie/${id}`);
//   return data;
// };

export const fetchPopularActors = async () => {
  const { data } = await tmbd.get("/person/popular?language=en-US&page=1");
  return data.results;
};

export const fetchCategoryMovies = async (category, page = 1) => {
  const endpoints = {
    popular: '/movie/popular',
    top_rated: '/movie/top_rated',
    upcoming: '/movie/upcoming',
    now_playing: '/movie/now_playing'
  };

  const { data } = await tmbd.get(endpoints[category], {
    params: {
      language: 'en-US',
      page: page
    }
  });
  return data;
};

export const getFavorites = () => {
  return JSON.parse(localStorage.getItem("favorites")) || [];
};

export const toggleFavoriteMovie = (movie) => {
  const current = getFavorites();
  const exists = current.some((m) => m.id === movie.id);

  let updated;
  if (exists) {
    updated = current.filter((m) => m.id !== movie.id);
  } else {
    updated = [...current, movie];
  }

  localStorage.setItem("favorites", JSON.stringify(updated));
  return updated;
};


export const getGenres = async () => {
  const { data } = await tmbd.get("/genre/movie/list", {
    params: { language: "en-US" },
  });
  return data.genres;
};


export const getMoviesByGenre = async (genreId, page = 1) => {
  const { data } = await tmbd.get("/discover/movie", {
    params: {
      with_genres: genreId,
      page,
      language: "en-US",
      sort_by: "popularity.desc",
    },
  });
  return data;
};