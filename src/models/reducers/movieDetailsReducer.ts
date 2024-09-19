// src/models/reducers/movieDetailsReducer.ts
import { Reducer } from 'redux';
import { FETCH_MOVIE_DETAILS, FETCH_MOVIE_DETAILS_SUCCESS, FETCH_MOVIE_DETAILS_FAILURE } from '../actions/movieDetailsActions';
import { MovieDetails } from '../types';

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

const movieDetailsReducer: Reducer<MovieDetailsState> = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MOVIE_DETAILS:
            return { ...state, loading: true, error: null };
        case FETCH_MOVIE_DETAILS_SUCCESS:
            return { ...state, movieDetails: action.payload as MovieDetails, loading: false };
        case FETCH_MOVIE_DETAILS_FAILURE:
            return { ...state, movieDetails: null, loading: false, error: action.payload as string };
        default:
            return state;
    }
};

export { movieDetailsReducer };
