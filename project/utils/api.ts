import axios from 'axios';

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

if (!TMDB_API_KEY) {
  throw new Error('TMDB API key is not set. Please set EXPO_PUBLIC_TMDB_API_KEY in your .env file.');
}

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getImageUrl = (path: string | null, size: string = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const fetchMovies = async (page: number = 1) => {
  try {
    const response = await api.get('/movie/popular', { params: { page } });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { results: [] };
  }
};

export const fetchTrending = async (timeWindow: 'day' | 'week' = 'week') => {
  try {
    const response = await api.get(`/trending/movie/${timeWindow}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return { results: [] };
  }
};

export const searchMovies = async (query: string, page: number = 1) => {
  try {
    const response = await api.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    return { results: [] };
  }
};

export const fetchMovieDetails = async (id: number) => {
  try {
    const [details, credits, videos] = await Promise.all([
      api.get(`/movie/${id}`),
      api.get(`/movie/${id}/credits`),
      api.get(`/movie/${id}/videos`),
    ]);

    const trailer = videos.data.results.find(
      (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
    );

    return {
      ...details.data,
      credits: credits.data,
      trailer,
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};