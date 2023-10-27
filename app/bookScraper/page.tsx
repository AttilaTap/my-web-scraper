"use client";

import React, { useEffect, useState } from "react";
import "../globals.css";

interface Genre {
  name: string;
  link: string;
}

interface Book {
  title: string;
  price: string;
}

const HomePage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("50");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGenres = () => {
    console.log("Attempting to fetch genres...");
    fetch("/api/genres")
      .then((res) => {
        console.log("Fetch status:", res.status);
        return res.text();
      })
      .then((text) => {
        console.log("Raw response:", text);
        const data = JSON.parse(text);
        console.log("Parsed data:", data);
        if (!data.genres) {
          throw new Error("Genres not found in the data");
        }

        const sortedGenres = data.genres.sort((a: Genre, b: Genre) => a.name.localeCompare(b.name));

        setGenres(sortedGenres);
      })
      .catch((error) => {
        console.error("Error while fetching genres:", error);
      });
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchBooks = () => {
    setLoading(true);
    setError(null);
    fetch(`/api/books?genreLink=${selectedGenre}&minPrice=${minPrice}&maxPrice=${maxPrice}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch books.");
        }
        return res.json();
      })
      .then((data) => {
        setBooks(data.books);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>Web Scraped Titles</h1>

      {/* Dropdown for genres */}
      <select
        value={selectedGenre}
        onChange={(e) => {
          console.log("Dropdown changed:", e.target.value);
          setSelectedGenre(e.target.value);
        }}
      >
        <option
          value=''
          disabled
        >
          Select a genre
        </option>
        {genres.map((genre, index) => (
          <option
            key={index}
            value={genre.link}
          >
            {genre.name}
          </option>
        ))}
      </select>

      {/* Inputs for price range */}
      <div>
        <label>
          Min Price:
          <input
            type='number'
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </label>
        <label>
          Max Price:
          <input
            type='number'
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </label>
      </div>

      <button onClick={fetchBooks}>Fetch Books</button>

      {/* Loading and Error Messages */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <ul>
        {books.map((book, index) => (
          <li key={index}>
            {book.title} - £{book.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
