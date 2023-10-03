"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Container, Typography, Button, Select, MenuItem, InputLabel, FormControl, TextField, CircularProgress, Box } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import { SelectChangeEvent } from "@mui/material/Select";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import RootLayout from "../layout";
import Image from "next/image";

const HomePage = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [maxResults, setMaxResults] = useState(5);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [showHighlight, setShowHighlight] = useState(false);
  const [highlightTimer, setHighlightTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [images, setImages] = useState<(string | Blob)[]>([]);
  const [carouselKey, setCarouselKey] = useState(0);

  useEffect(() => {
    const clearHighlightTimer = () => {
      if (highlightTimer) {
        clearInterval(highlightTimer);
      }
    };

    if (isFetching) {
      const initialTimer = setTimeout(() => {
        setShowHighlight(true);
        setHighlightTimer(
          setInterval(() => {
            setShowHighlight(true);
            setTimeout(() => setShowHighlight(false), 3000);
          }, 10000),
        );
      }, 5000);

      return () => {
        clearTimeout(initialTimer);
        clearHighlightTimer();
      };
    } else {
      setShowHighlight(false);
      clearHighlightTimer();
    }
  }, [isFetching, highlightTimer]);

  const fetchTitles = async () => {
    setIsFetching(true);
    setStartTime(Date.now());
    setEndTime(null);
    setImages([]); // Reset images on new fetch

    const requestOptions: RequestInit = {
      method: "GET",
      headers: {
        sourcePage: "9gagScraperV2",
      },
    };

    try {
      const res = await fetch(`/api/9gag?maxResults=${maxResults}&section=${selectedSection}`, requestOptions);
      const data = await res.json();
      setImages(data.images);
      setCarouselKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsFetching(false);
      setEndTime(Date.now());
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setMaxResults(Math.min(100, Math.max(1, isNaN(val) ? 1 : val)));
  };

  const handleSectionChange = (e: SelectChangeEvent<string>) => {
    setSelectedSection(e.target.value);
  };

  const duration = endTime && startTime ? ((endTime - startTime) / 1000).toFixed(2) : null;

  return (
    <RootLayout>
      <Container
        maxWidth='lg'
        sx={{ minHeight: "100vh" }}
      >
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
        <Box
          mb={2}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <FormControl
            variant='filled'
            sx={{ marginRight: "20px", width: "200px" }}
          >
            <InputLabel id='section-label'>Section</InputLabel>
            <Select
              labelId='section-label'
              id='section'
              value={selectedSection}
              onChange={handleSectionChange}
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
            sx={{ marginLeft: "20px", width: "200px" }}
          >
            <TextField
              type='number'
              id='maxResults'
              value={maxResults}
              onChange={handleInputChange}
              variant='filled'
              label='Number of results'
              InputProps={{ inputProps: { min: 1, max: 10 } }}
            />
          </FormControl>
        </Box>
        {duration && <Typography variant='body1'>Fetch duration: {duration} seconds</Typography>}
        <div style={{ maxWidth: "1024px", margin: "auto" }}>
          <Carousel
            key={carouselKey}
            dynamicHeight={true}
            emulateTouch={true}
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            showArrows={true}
            infiniteLoop={true}
            swipeable={true}
            selectedItem={0}
          >
            {images.map((base64Image, index) => (
              <div
                key={index}
                style={{ position: "relative", height: "768px", width: "1024px" }}
              >
                <Image
                  src={`data:image/png;base64,${base64Image}`}
                  alt={`image-${index}`}
                  layout='fill'
                  objectFit='cover'
                />
              </div>
            ))}
          </Carousel>
        </div>
      </Container>
    </RootLayout>
  );
};

export default HomePage;
