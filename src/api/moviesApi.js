import { supabase } from "../lib/supabase";
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

// export const getFavorites = () => {
//   return JSON.parse(localStorage.getItem("favorites")) || [];
// };

// export const toggleFavoriteMovie = (movie) => {
//   const current = getFavorites();
//   const exists = current.some((m) => m.id === movie.id);

//   let updated;
//   if (exists) {
//     updated = current.filter((m) => m.id !== movie.id);
//   } else {
//     updated = [...current, movie];
//   }

//   localStorage.setItem("favorites", JSON.stringify(updated));
//   return updated;
// };


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




// 

// Get current user
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Get favorites (guest or authenticated)
export const getFavorites = async () => {
  const user = await getCurrentUser();

  if (user) {
    // Authenticated user - get from Supabase
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }

    return data.map(fav => fav.movie_data);
  } else {
    // Guest user - get from localStorage
    return JSON.parse(localStorage.getItem("favorites")) || [];
  }
};

// Toggle favorite (guest or authenticated)
export const toggleFavoriteMovie = async (movie) => {
  const user = await getCurrentUser();

  if (user) {
    // Authenticated user - toggle in Supabase
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movie.id)
      .single();

    if (existing) {
      // Remove from favorites
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movie.id);

      if (error) throw error;
    } else {
      // Add to favorites
      const { error } = await supabase
        .from("favorites")
        .insert({
          user_id: user.id,
          movie_id: movie.id,
          movie_data: movie
        });

      if (error) throw error;
    }

    // Return updated favorites
    return await getFavorites();
  } else {
    // Guest user - toggle in localStorage
    const current = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = current.some((m) => m.id === movie.id);

    let updated;
    if (exists) {
      updated = current.filter((m) => m.id !== movie.id);
    } else {
      updated = [...current, movie];
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    return updated;
  }
};

// Check if movie is favorite
export const isMovieFavorite = async (movieId) => {
  const user = await getCurrentUser();

  if (user) {
    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .single();

    return !!data;
  } else {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.some(m => m.id === movieId);
  }
};

// Sync localStorage favorites to Supabase when user logs in
export const syncFavoritesToSupabase = async () => {
  const user = await getCurrentUser();
  if (!user) return;

  const localFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
  
  if (localFavorites.length === 0) return;

  // Get existing favorites from Supabase
  const { data: existingFavorites } = await supabase
    .from("favorites")
    .select("movie_id")
    .eq("user_id", user.id);

  const existingIds = existingFavorites?.map(f => f.movie_id) || [];

  // Filter out movies that already exist in Supabase
  const newFavorites = localFavorites.filter(
    movie => !existingIds.includes(movie.id)
  );

  // Insert new favorites
  if (newFavorites.length > 0) {
    const { error } = await supabase
      .from("favorites")
      .insert(
        newFavorites.map(movie => ({
          user_id: user.id,
          movie_id: movie.id,
          movie_data: movie
        }))
      );

    if (error) {
      console.error("Error syncing favorites:", error);
    } else {
      // Clear localStorage after successful sync
      localStorage.removeItem("favorites");
    }
  }
};