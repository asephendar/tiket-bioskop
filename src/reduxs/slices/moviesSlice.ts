import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const OMDB_API_KEY = 'fdbb1342'; // Your OMDB API key

export interface Movie {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
}

interface MoviesState {
    movies: Movie[];
    loading: boolean;
    error: string | null;
}

const initialState: MoviesState = {
    movies: [],
    loading: false,
    error: null,
};

export const fetchMovies = createAsyncThunk(
    'movies/fetchMovies',
    async (query: string) => {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`);
        if (response.data.Response === 'True') {
            return response.data.Search;
        } else {
            throw new Error(response.data.Error);
        }
    }
);

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.movies = action.payload;
                state.loading = false;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.movies = [];
                state.error = action.error.message || 'Failed to fetch movies';
                state.loading = false;
            });
    },
});

export default moviesSlice.reducer;
