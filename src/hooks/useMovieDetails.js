import { useQuery } from "@tanstack/react-query"
import { getMovieDetails } from "../api/moviesApi"


export const useMovieDetails = (id)=>{
    return useQuery({
        queryKey: ['movieDetails', id],
        queryFn: ()=> getMovieDetails(id),
        staleTime: 1000 * 60 * 60,
        enabled: !!id,
    })
}