"use client";

import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [prices, setTitles] = useState([]);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        setTitles(data.prices);
      });
  }, []);

  return (
    <div>
      <h1>Web Scraped Titles</h1>
      <ul>
        {prices.map((price, index) => (
          <li key={index}>{price}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;