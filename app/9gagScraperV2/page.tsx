"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import Container from "../components/container";
import Title from "../components/title";
import Button from "../components/button";
import Label from "../components/label";
import Input from "../components/input";
import Image from "next/image";

const HomePage = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [maxResults, setMaxResults] = useState(10); // Default value
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [showHighlight, setShowHighlight] = useState(false);
  const [highlightTimer, setHighlightTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [images, setImages] = useState<(string | Blob)[]>([]);

  useEffect(() => {
    if (isFetching) {
      const initialTimer = setTimeout(() => {
        setShowHighlight(true);
        setHighlightTimer(
          setInterval(() => {
            setShowHighlight(true);
            setTimeout(() => setShowHighlight(false), 3000);
          }, 10000) as unknown as ReturnType<typeof setInterval>,
        );
      }, 5000);

      return () => {
        clearTimeout(initialTimer);
        if (highlightTimer !== null) {
          clearInterval(highlightTimer as unknown as ReturnType<typeof setInterval>);
        }
      };
    } else {
      setShowHighlight(false);
      if (highlightTimer !== null) {
        clearInterval(highlightTimer as unknown as ReturnType<typeof setInterval>);
      }
    }
  }, [isFetching, highlightTimer]);

  const fetchTitles = () => {
    setIsFetching(true);
    setStartTime(Date.now());
    setEndTime(null);

    const requestOptions: RequestInit = {
      method: "GET",
      headers: {
        sourcePage: "9gagScraperV2",
      },
    };

    fetch(`/api/9gag?maxResults=${maxResults}&section=${selectedSection}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setImages((prevImages) => [...prevImages, ...data.images]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsFetching(false);
        setEndTime(Date.now());
      });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setMaxResults(Math.min(100, Math.max(1, isNaN(val) ? 1 : val)));
  };

  const duration = endTime && startTime ? ((endTime - startTime) / 1000).toFixed(2) : null;

  const handleSectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSection(e.target.value);
  };

  return (
    <Container>
      <Title>
        {maxResults} Scraped Title(s) from 9GAG/{selectedSection}
      </Title>
      <div>
        <Label htmlFor='section'>Section:</Label>
        <Button
          onClick={fetchTitles}
          disabled={isFetching}
        >
          {isFetching ? "Fetching..." : "Fetch Titles"}
        </Button>
        <select
          id='section'
          value={selectedSection}
          onChange={handleSectionChange}
        >
          <option value='top'>Top</option>
          <option value='trending'>Trending</option>
          <option value='fresh'>Fresh</option>
          <option value='home'>Home</option>
          <option value=''>Nothing</option>
        </select>
        <Label htmlFor='maxResults'>Number of results:</Label>
        <Input
          type='number'
          id='maxResults'
          value={maxResults}
          min='1'
          max='100'
          onChange={handleInputChange}
        />
      </div>
      {duration && <p>Fetch duration: {duration} seconds</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {images.map((base64Image, index) => (
          <div key={index}>
            <img
              src={`data:image/png;base64,${base64Image}`}
              alt={`image-${index}`}
              width='200'
              height='200'
            />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default HomePage;
