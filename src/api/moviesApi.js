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


// Get current user
const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

// Get favorites (Supabase for authenticated, localStorage for guests)
export const getFavorites = async () => {
  try {
    const user = await getCurrentUser();

    if (user) {
      // Authenticated user - get from Supabase
      console.log("Getting favorites from Supabase for user:", user.id);
      
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        return [];
      }

      console.log("Favorites from Supabase:", data);
      
      // Convert Supabase data to movie format
      return data?.map(fav => ({
        id: fav.movie_id,
        title: fav.title,
        poster_path: fav.poster_path,
        release_date: fav.release_date,
        vote_average: fav.vote_average,
        overview: fav.overview
      })) || [];
    } else {
      // Guest user - get from localStorage
      console.log("Getting favorites from localStorage (guest)");
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      console.log("Favorites from localStorage:", favorites);
      return favorites;
    }
  } catch (error) {
    console.error("Error in getFavorites:", error);
    return [];
  }
};

// Toggle favorite (Supabase for authenticated, localStorage for guests)
export const toggleFavoriteMovie = async (movie) => {
  try {
    const user = await getCurrentUser();

    if (user) {
      // Authenticated user - toggle in Supabase
      console.log("Toggling favorite in Supabase for user:", user.id);

      // Check if already exists
      const { data: existing, error: checkError } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("movie_id", movie.id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing favorite:", checkError);
        throw checkError;
      }

      if (existing) {
        // Remove from favorites
        console.log("Removing from favorites:", movie.id);
        const { error: deleteError } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movie.id);

        if (deleteError) throw deleteError;
      } else {
        // Add to favorites
        console.log("Adding to favorites:", movie.id);
        const { error: insertError } = await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            movie_id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            overview: movie.overview
          });

        if (insertError) {
          console.error("Insert error:", insertError);
          throw insertError;
        }
      }

      // Return updated favorites
      return await getFavorites();
    } else {
      // Guest user - toggle in localStorage
      console.log("Toggling favorite in localStorage (guest)");
      
      const current = JSON.parse(localStorage.getItem("favorites")) || [];
      const exists = current.some((m) => m.id === movie.id);

      let updated;
      if (exists) {
        console.log("Removing from localStorage:", movie.id);
        updated = current.filter((m) => m.id !== movie.id);
      } else {
        console.log("Adding to localStorage:", movie.id);
        updated = [...current, movie];
      }

      localStorage.setItem("favorites", JSON.stringify(updated));
      console.log("Updated localStorage favorites:", updated);
      return updated;
    }
  } catch (error) {
    console.error("Error in toggleFavoriteMovie:", error);
    throw error;
  }
};

// Sync localStorage favorites to Supabase when user logs in
export const syncFavoritesToSupabase = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log("No user logged in, skipping sync");
      return;
    }

    const localFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    if (localFavorites.length === 0) {
      console.log("No local favorites to sync");
      return;
    }

    console.log("Syncing", localFavorites.length, "favorites to Supabase");

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
      console.log("Inserting", newFavorites.length, "new favorites");
      
      const { error } = await supabase
        .from("favorites")
        .insert(
          newFavorites.map(movie => ({
            user_id: user.id,
            movie_id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            overview: movie.overview
          }))
        );

      if (error) {
        console.error("Error syncing favorites:", error);
        throw error;
      }

      // Clear localStorage after successful sync
      localStorage.removeItem("favorites");
      console.log("Sync complete, localStorage cleared");
    }
  } catch (error) {
    console.error("Error in syncFavoritesToSupabase:", error);
  }
};


// Get watchlist
export const getWatchlist = async () => {
  try {
    const user = await getCurrentUser();

    if (user) {
      console.log("Getting watchlist from Supabase for user:", user.id);
      
      const { data, error } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase watchlist error:", error);
        return [];
      }

      console.log("Watchlist from Supabase:", data);
      
      return data?.map(item => ({
        id: item.movie_id,
        title: item.title,
        poster_path: item.poster_path,
        release_date: item.release_date,
        vote_average: item.vote_average,
        overview: item.overview
      })) || [];
    } else {
      console.log("Getting watchlist from localStorage (guest)");
      const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      console.log("Watchlist from localStorage:", watchlist);
      return watchlist;
    }
  } catch (error) {
    console.error("Error in getWatchlist:", error);
    return [];
  }
};

// Toggle watchlist
export const toggleWatchlistMovie = async (movie) => {
  try {
    const user = await getCurrentUser();

    if (user) {
      console.log("Toggling watchlist in Supabase for user:", user.id, "movie:", movie.id);

      const { data: existing, error: checkError } = await supabase
        .from("watchlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("movie_id", movie.id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing watchlist:", checkError);
        throw checkError;
      }

      if (existing) {
        console.log("Removing from watchlist:", movie.id);
        const { error: deleteError } = await supabase
          .from("watchlist")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movie.id);

        if (deleteError) {
          console.error("Delete error:", deleteError);
          throw deleteError;
        }
      } else {
        console.log("Adding to watchlist:", movie.id);
        const { error: insertError } = await supabase
          .from("watchlist")
          .insert({
            user_id: user.id,
            movie_id: movie.id,
            title: movie.title || "Unknown",
            poster_path: movie.poster_path || null,
            release_date: movie.release_date || null,
            vote_average: movie.vote_average || null,
            overview: movie.overview || null
          });

        if (insertError) {
          console.error("Insert error:", insertError);
          throw insertError;
        }
      }

      return await getWatchlist();
    } else {
      console.log("Toggling watchlist in localStorage (guest)");
      
      const current = JSON.parse(localStorage.getItem("watchlist")) || [];
      const exists = current.some((m) => m.id === movie.id);

      let updated;
      if (exists) {
        console.log("Removing from localStorage watchlist:", movie.id);
        updated = current.filter((m) => m.id !== movie.id);
      } else {
        console.log("Adding to localStorage watchlist:", movie.id);
        updated = [...current, movie];
      }

      localStorage.setItem("watchlist", JSON.stringify(updated));
      console.log("Updated localStorage watchlist:", updated);
      return updated;
    }
  } catch (error) {
    console.error("Error in toggleWatchlistMovie:", error);
    throw error;
  }
};

// Sync localStorage watchlist to Supabase
export const syncWatchlistToSupabase = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log("No user logged in, skipping watchlist sync");
      return;
    }

    const localWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    
    if (localWatchlist.length === 0) {
      console.log("No local watchlist to sync");
      return;
    }

    console.log("Syncing", localWatchlist.length, "watchlist items to Supabase");

    const { data: existingWatchlist } = await supabase
      .from("watchlist")
      .select("movie_id")
      .eq("user_id", user.id);

    const existingIds = existingWatchlist?.map(item => item.movie_id) || [];
    const newItems = localWatchlist.filter(
      movie => !existingIds.includes(movie.id)
    );

    if (newItems.length > 0) {
      console.log("Inserting", newItems.length, "new watchlist items");
      
      const { error } = await supabase
        .from("watchlist")
        .insert(
          newItems.map(movie => ({
            user_id: user.id,
            movie_id: movie.id,
            title: movie.title || "Unknown",
            poster_path: movie.poster_path || null,
            release_date: movie.release_date || null,
            vote_average: movie.vote_average || null,
            overview: movie.overview || null
          }))
        );

      if (error) {
        console.error("Error syncing watchlist:", error);
        throw error;
      }

      localStorage.removeItem("watchlist");
      console.log("Watchlist sync complete, localStorage cleared");
    }
  } catch (error) {
    console.error("Error in syncWatchlistToSupabase:", error);
  }
};





// Get recommendations based on user's favorites
export const getRecommendations = async () => {
  try {
    const favorites = await getFavorites();
    
    if (favorites.length === 0) {
 
      const response = await tmbd.get("/movie/top_rated", {
        params: {
          language: "en-US",
          page: 1,
        },
      });
      return response.data.results;
    }

 
    const sampleMovies = favorites.slice(0, 3);
    
    
    const allRecommendations = [];
    
    for (const movie of sampleMovies) {
      try {
        const response = await tmbd.get(`/movie/${movie.id}/recommendations`, {
          params: {
            language: "en-US",
            page: 1,
          },
        });
        allRecommendations.push(...response.data.results);
      } catch (error) {
        console.error(`Error fetching recommendations for movie ${movie.id}:`, error);
      }
    }

    // Remove duplicates based on movie id
    const uniqueRecommendations = Array.from(
      new Map(allRecommendations.map(movie => [movie.id, movie])).values()
    );

    return uniqueRecommendations.slice(0, 20);
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    return [];
  }
};

// Get recommendations based on genre
export const getRecommendationsByGenre = async (genreId) => {
  try {
    const response = await tmbd.get("/discover/movie", {
      params: {
        with_genres: genreId,
        sort_by: "vote_average.desc",
        "vote_count.gte": 1000,
        language: "en-US",
        page: 1,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching recommendations by genre:", error);
    return [];
  }
};