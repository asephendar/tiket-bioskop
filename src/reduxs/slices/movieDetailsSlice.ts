import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const OMDB_API_KEY = 'fdbb1342'; // Your OMDB API key

export interface MovieDetails {
    Title: string;
    Poster: string;
    Plot: string;
    Genre: string;
    Runtime: string;
    // Add other fields as needed
}

interface MovieDetailsState {
    movieDetails: MovieDetails | null;
    loading: boolean;
    error: string | null;
}

const initialState: MovieDetailsState = {
    movieDetails: null,
    loading: false,
    error: null,
};

export const fetchMovieDetails = createAsyncThunk(
    'movieDetails/fetchMovieDetails',
    async (imdbID: string) => {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}`);
        if (response.data.Response === 'True') {
            return response.data;
        } else {
            throw new Error(response.data.Error);
        }
    }
);

const movieDetailsSlice = createSlice({
    name: 'movieDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovieDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovieDetails.fulfilled, (state, action) => {
                state.movieDetails = action.payload;
                state.loading = false;
            })
            .addCase(fetchMovieDetails.rejected, (state, action) => {
                state.movieDetails = null;
                state.error = action.error.message || 'Failed to fetch movie details';
                state.loading = false;
            });
    },
});

export default movieDetailsSlice.reducer;
