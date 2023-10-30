"use client";

import React, { useEffect, useState } from "react";
import "../globals.css";
import styles from "./page.module.css";

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
    <div className={styles.container}>
      <h1 className={styles.title}>Scraping from books.toscrape.com </h1>

      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
        className={styles.dropdown}
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

      <div className={styles.priceRange}>
        <label>
          Min Price:
          <input
            type='number'
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className={styles.priceInput}
          />
        </label>
        <label>
          Max Price:
          <input
            type='number'
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={styles.priceInput}
          />
        </label>
      </div>

      <button
        onClick={fetchBooks}
        className={styles.actionButton}
      >
        Fetch Books
      </button>

      {/* Loading and Error Messages */}
      {loading && <p className={styles.message}>Loading...</p>}
      {error && <p className={`${styles.message} ${styles.error}`}>Error: {error}</p>}

      <ul className={styles.bookList}>
        {books.map((book, index) => (
          <li
            key={index}
            className={styles.bookItem}
          >
            {book.title} - £{book.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;