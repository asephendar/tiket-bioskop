import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import movieDetailsReducer from './slices/movieDetailsSlice';

const store = configureStore({
    reducer: {
        movies: moviesReducer,
        movieDetails: movieDetailsReducer,
    },
});
console.log(store.getState());

store.subscribe(() => {
    console.log(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
