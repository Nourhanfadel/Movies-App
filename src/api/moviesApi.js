import { tmbd } from "./tmdb";

export const getPopularMovies= async () =>{
    const res = await tmbd.get("/movie/popular");
    return res.data.results;
}