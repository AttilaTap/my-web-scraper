"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import Container from "../components/container";
import Title from "../components/title";
import Button from "../components/button";
import Label from "../components/label";
import Input from "../components/input";
import List from "../components/list";
import ListItem from "../components/listItem";

interface HighlightedTextProps {
  show: boolean;
  children: React.ReactNode;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ show, children }) => {
  const [opacity, setOpacity] = useState(show ? 1 : 0);

  useEffect(() => {
    setOpacity(show ? 1 : 0);
  }, [show]);

  return <p style={{ opacity: opacity, transition: "opacity 1s ease-in-out" }}>{children}</p>;
};

const HomePage = () => {
  const [titles, setTitles] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [maxResults, setMaxResults] = useState(5);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [showHighlight, setShowHighlight] = useState(false);
  const [highlightTimer, setHighlightTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  const [selectedSection, setSelectedSection] = useState("");

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
    setTitles([]);
    setIsFetching(true);
    setStartTime(Date.now());
    setEndTime(null);

    fetch(`/api/9gag?maxResults=${maxResults}&section=${selectedSection}`, {
      method: "GET",
      headers: {
        sourcePage: "9gagScraper",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        if (res.headers.get("Content-Type")?.indexOf("application/json") === -1) {
          throw new Error(`Unexpected Content-Type: ${res.headers.get("Content-Type")}`);
        }
        return res.json();
      })
      .then((data) => {
        setTitles(data.titles);
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
      <List>
        <HighlightedText show={showHighlight}>Uhh this might take long...</HighlightedText>
        {titles.map((title, index) => (
          <ListItem key={index}>{title}</ListItem>
        ))}
      </List>
    </Container>
  );
};

export default HomePage;
