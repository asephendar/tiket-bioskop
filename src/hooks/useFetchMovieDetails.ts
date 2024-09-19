// src/hooks/useFetchMovieDetails.ts

import { useState } from 'react';
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

export const useFetchMovieDetails = () => {
    const [movieDetails, setMovieDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMovieDetails = async (imdbID: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}`);
            if (response.data.Response === 'True') {
                setMovieDetails(response.data);
                setError(null);
            } else {
                setMovieDetails(null);
                setError(response.data.Error);
            }
        } catch (err) {
            setError('Failed to fetch movie details');
        } finally {
            setLoading(false);
        }
    };

    return { movieDetails, loading, error, fetchMovieDetails };
};
