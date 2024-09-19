// src/hooks/useFetchMovies.ts

import { useState } from 'react';
import axios from 'axios';

const OMDB_API_KEY = 'fdbb1342'; // Your OMDB API key

export interface Movie {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
}

export const useFetchMovies = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMovies = async (query: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`);
            if (response.data.Response === 'True') {
                setMovies(response.data.Search); // Set list of movies
                setError(null);
            } else {
                setMovies([]);
                setError(response.data.Error); // Show error message
            }
        } catch (err) {
            setError('Failed to fetch movies');
        } finally {
            setLoading(false);
        }
    };

    return { movies, loading, error, fetchMovies };
};
