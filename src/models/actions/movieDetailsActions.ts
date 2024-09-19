// src/models/actions/movieDetailsActions.ts
import axios from 'axios';
import { Dispatch } from 'redux';

export const FETCH_MOVIE_DETAILS = 'FETCH_MOVIE_DETAILS';
export const FETCH_MOVIE_DETAILS_SUCCESS = 'FETCH_MOVIE_DETAILS_SUCCESS';
export const FETCH_MOVIE_DETAILS_FAILURE = 'FETCH_MOVIE_DETAILS_FAILURE';

interface FetchMovieDetailsAction {
    type: typeof FETCH_MOVIE_DETAILS;
}

interface FetchMovieDetailsSuccessAction {
    type: typeof FETCH_MOVIE_DETAILS_SUCCESS;
    payload: any; // Sesuaikan dengan tipe data untuk detail film
}

interface FetchMovieDetailsFailureAction {
    type: typeof FETCH_MOVIE_DETAILS_FAILURE;
    payload: string;
}

type MovieDetailsActionTypes = FetchMovieDetailsAction | FetchMovieDetailsSuccessAction | FetchMovieDetailsFailureAction;

export const fetchMovieDetails = (movieId: string) => async (dispatch: Dispatch<MovieDetailsActionTypes>) => {
    dispatch({ type: FETCH_MOVIE_DETAILS });
    try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=fdbb1342&i=${movieId}`);
        if (response.data.Response === 'True') {
            dispatch({ type: FETCH_MOVIE_DETAILS_SUCCESS, payload: response.data });
        } else {
            dispatch({ type: FETCH_MOVIE_DETAILS_FAILURE, payload: response.data.Error });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            dispatch({ type: FETCH_MOVIE_DETAILS_FAILURE, payload: error.message });
        } else {
            dispatch({ type: FETCH_MOVIE_DETAILS_FAILURE, payload: 'An unknown error occurred' });
        }
    }
};
