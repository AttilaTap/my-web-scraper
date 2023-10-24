"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RootLayout from "../layout";
import "../globals.css";

const HomePage = () => {
  const [titles, setTitles] = useState([]); // Adjusted the variable name to titles
  const router = useRouter();

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        setTitles(data.prices); // Adjusted to the variable name 'titles'
      });
  }, []);

  return (
    <RootLayout onBackClick={() => router.back()}>
      <div>
        <h1>Web Scraped Titles</h1>
        <ul>
          {titles.map((title, index) => ( // Adjusted the variable name 'titles' and 'title'
            <li key={index}>{title}</li>
          ))}
        </ul>
      </div>
    </RootLayout>
  );
};

export default HomePage;
