// src/models/actions/moviesActions.ts
import axios from 'axios';

export const SEARCH_MOVIES = 'SEARCH_MOVIES';
export const SEARCH_MOVIES_SUCCESS = 'SEARCH_MOVIES_SUCCESS';
export const SEARCH_MOVIES_FAILURE = 'SEARCH_MOVIES_FAILURE';

export const searchMovies = (query: string) => async (dispatch: any) => {
    dispatch({ type: SEARCH_MOVIES });
    try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=fdbb1342&s=${query}`);
        if (response.data.Response === 'True') {
            dispatch({ type: SEARCH_MOVIES_SUCCESS, payload: response.data.Search });
        } else {
            dispatch({ type: SEARCH_MOVIES_FAILURE, payload: response.data.Error });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
          dispatch({ type: SEARCH_MOVIES_FAILURE, payload: error.message });
        } else {
          // Handle other types of errors
          dispatch({ type: SEARCH_MOVIES_FAILURE, payload: 'An unknown error occurred' });
        }
      }
};
