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
  return res.data; // data includes results, total_pages, page
};