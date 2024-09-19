// src/models/reducers/rootReducer.ts
import { combineReducers } from 'redux';
import { moviesReducer } from './moviesReducer';
import { movieDetailsReducer } from './movieDetailsReducer';

// Gabungkan reducers menjadi satu reducer utama
const rootReducer = combineReducers({
    movies: moviesReducer,
    movieDetails: movieDetailsReducer,
    // tambahkan reducers lain di sini jika ada
});

// Tipe untuk state aplikasi
export type AppState = ReturnType<typeof rootReducer>;

export { rootReducer };
