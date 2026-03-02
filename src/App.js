import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@material-ui/core";

import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import { getPlacesData } from "./api";

const App = () => {
  const [places, setPlaces] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBoundary] = useState({});
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [autocomplete, setAutoComplete] = useState(null);

  // Get user's location on first load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  // Filter places based on rating
  useEffect(() => {
    if (rating) {
      const filtered = places.filter((place) => Number(place.rating) >= rating);
      setFilteredPlaces(filtered);
    } else {
      setFilteredPlaces(places); // Show all places if no rating selected
    }
  }, [rating, places]);

  useEffect(() => {
    if (bounds.sw && bounds.ne) {
      setIsLoading(true);
      console.log(`Fetching ${type} data...`);

      getPlacesData(type, bounds.sw, bounds.ne)
        .then((data) => {
          console.log(`Received ${data?.length || 0} ${type} results`);
          if (data && data.length > 0) {
            setPlaces(data.filter((place) => place.name));
            setFilteredPlaces([]);
          } else {
            console.log(`No ${type} data found for the current area`);
            setPlaces([]);
            setFilteredPlaces([]);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(`Error fetching ${type}:`, error);
          setPlaces([]);
          setFilteredPlaces([]);
          setIsLoading(false);
        });
    }
  }, [type, bounds]);

  // AutoComplete handling
  const onLoad = (autoC) => setAutoComplete(autoC);
  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();
    setCoordinates({ lat, lng });
  };

  return (
    <>
      <CssBaseline />
      <Header onLoad={onLoad} onPlaceChanged={onPlaceChanged} />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBoundary={setBoundary}
            coordinates={coordinates}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;

