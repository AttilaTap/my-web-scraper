"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Container, Typography, Button, Select, MenuItem, InputLabel, FormControl, TextField, CircularProgress, SelectChangeEvent, Box } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import RootLayout from "../layout";
import Image from "next/image";


const HomePage = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [maxResults, setMaxResults] = useState(5); // Default value
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

  const handleSectionChange = (e: SelectChangeEvent<string>) => {
    setSelectedSection(e.target.value as string);
  };

  return (
    <RootLayout>
      <Container maxWidth='lg' sx={{ minHeight: '100vh' }}>
        <Box
          pt={4}
          pb={2}
        >
          <Typography
            variant='h4'
            gutterBottom
          >
            {maxResults} Scraped Screenshot(s) from 9GAG/{selectedSection}
          </Typography>
        </Box>
        <Box mb={2}>
          <FormControl
            variant='filled'
            style={{ marginRight: "20px" }}
          >
            <InputLabel id='section-label'>Section</InputLabel>
            <Select
              labelId='section-label'
              id='section'
              value={selectedSection}
              onChange={handleSectionChange}
              sx={{ width: '200px' }}
            >
              <MenuItem value='top'>Top</MenuItem>
              <MenuItem value='trending'>Trending</MenuItem>
              <MenuItem value='fresh'>Fresh</MenuItem>
              <MenuItem value='home'>Home</MenuItem>
              <MenuItem value=''>Nothing</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant='contained'
            color='primary'
            onClick={fetchTitles}
            disabled={isFetching}
            startIcon={isFetching ? <CircularProgress size={20} /> : null}
          >
            {isFetching ? "Fetching..." : "Fetch Screenshots"}
          </Button>
          <FormControl
            variant='filled'
            style={{ marginLeft: "20px" }}
          >
            <InputLabel htmlFor='maxResults'></InputLabel>
            <TextField
              type='number'
              id='maxResults'
              value={maxResults}
              onChange={handleInputChange}
              variant='filled'
              label='Number of results'
              InputProps={{ inputProps: { min: 1, max: 10 } }}
              sx={{ width: "200px" }}
            />
          </FormControl>
        </Box>
        {duration && <Typography variant='body1'>Fetch duration: {duration} seconds</Typography>}
        <Carousel>
          {images.map((base64Image, index) => (
            <div key={index}>
              <Image
                src={`data:image/png;base64,${base64Image}`}
                alt={`image-${index}`}
                width={500}
                height={500}
              />
            </div>
          ))}
        </Carousel>
      </Container>
    </RootLayout>
  );
};

export default HomePage;
