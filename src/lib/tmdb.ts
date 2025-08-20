import { Movie, MovieSearchResult } from "@/types/tmdb";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!API_KEY) throw new Error("TMDB_API_KEY is not defined");
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=ja-JP`
  );
  if (!response.ok) throw new Error("Failed to search movies");
  const data: MovieSearchResult = await response.json();
  return data.results;
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  if (!API_KEY) throw new Error("TMDB_API_KEY is not defined");
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=ja-JP`
  );
  if (!response.ok) throw new Error("Failed to get movie details");
  const data: Movie = await response.json();
  return data;
};
