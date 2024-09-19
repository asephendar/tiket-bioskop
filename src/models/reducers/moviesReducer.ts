// src/models/reducers/moviesReducer.ts
import { Reducer } from 'redux';
import { SEARCH_MOVIES, SEARCH_MOVIES_SUCCESS, SEARCH_MOVIES_FAILURE } from '../actions/moviesActions';
import { Movie } from '@models/types';

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

const moviesReducer: Reducer<MoviesState> = (state = initialState, action: { type: string; payload?: Movie[] | string }) => {
    switch (action.type) {
        case SEARCH_MOVIES:
            return { ...state, loading: true, error: null };
        case SEARCH_MOVIES_SUCCESS:
            return { ...state, movies: action.payload as Movie[], loading: false };
        case SEARCH_MOVIES_FAILURE:
            return { ...state, movies: [], loading: false, error: action.payload as string };
        default:
            return state;
    }
};

export { moviesReducer };
