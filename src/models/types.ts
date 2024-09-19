// src/models/types.ts

export interface Movie {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
}

export interface MovieDetails {
    Title: string;
    Poster: string;
    Plot: string;
    Genre: string;
    Runtime: string;
}
