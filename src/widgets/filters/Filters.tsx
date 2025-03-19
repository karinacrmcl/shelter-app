import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Fab,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  SelectChangeEvent,
  Slider,
} from "@mui/material";
import CardLayout from "../../shared/layouts/card/CardLayout";
import s from "./Filters.module.scss";
import { useBreedsQuery } from "../../store/api/dogApi";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { useSelector, useDispatch } from "react-redux";
import {
  setBreeds,
  setRadius,
  setAgeRange,
  setSortBy,
  resetFilters,
  setLocation,
} from "../../store/slices/filtersSlice";
import { selectFilters } from "../../store/assets/selectors";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery } from "react-responsive";
import classNames from "classnames";
import GoogleMaps from "./Autocomplete";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Default fallback: San Francisco
const DEFAULT_LOCATION = { lat: 37.7749, lng: -122.4194 };

export function Filters() {
  const dispatch = useDispatch();
  const { data: breeds, isLoading } = useBreedsQuery();
  const isMobile = useMediaQuery({ maxWidth: "760px" });
  const [open, setOpen] = useState(false);

  const { selectedBreeds, radius, ageRange, sortBy, location } =
    useSelector(selectFilters);

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      console.warn("Google Maps API is not loaded yet.");
      return;
    }

    const determineLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const userLocation = new window.google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            fetchZipCode(userLocation);
          },
          async () => {
            console.warn(
              "Geolocation permission denied. Using default location."
            );
            const fallbackLocation = new window.google.maps.LatLng(
              DEFAULT_LOCATION.lat,
              DEFAULT_LOCATION.lng
            );
            fetchZipCode(fallbackLocation);
          }
        );
      }
    };

    determineLocation();
  }, [GOOGLE_MAPS_API_KEY, isLoading]);

  const fetchZipCode = async (loc: google.maps.LatLng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.lat()},${loc.lng()}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        const addressComponent = data.results
          .flatMap((result: any) => result.address_components)
          .find((component: any) => component.types.includes("postal_code"));

        if (addressComponent) {
          const zipCode = addressComponent.long_name;
          console.log("Determined Zip Code:", zipCode);
          dispatch(setLocation({ zipCode }));
        } else {
          console.warn("No ZIP code found in the geolocation results.");
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  return (
    <>
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          className={s.mobile_button}
          onClick={() => setOpen((p) => !p)}
          variant="extended"
        >
          {open ? <CloseIcon /> : <TuneIcon />} Filters
        </Fab>
      )}
      <CardLayout
        title="Filters"
        className={classNames(s.container, { [s.open]: open })}
      >
        <FormControl fullWidth>
          <InputLabel id="sort-select-label">Sort by</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={sortBy}
            label="Sort by"
            onChange={(event: SelectChangeEvent) =>
              dispatch(setSortBy(event.target.value as "name-a-z" | "name-z-a"))
            }
          >
            <MenuItem value="name-a-z">Name (A → Z)</MenuItem>
            <MenuItem value="name-z-a">Name (Z → A)</MenuItem>
            <MenuItem value="age-asc">Age: Low to High</MenuItem>
            <MenuItem value="age-desc">Age: High to Low</MenuItem>
          </Select>
        </FormControl>

        <div className={s.location_header}>
          <h4>Location</h4>

          <PopupState variant="popover" popupId="location-popover">
            {(popupState) => (
              <div>
                <Button
                  style={{ textTransform: "none" }}
                  size="small"
                  {...bindTrigger(popupState)}
                >
                  {location?.zipCode || "Select Location"}
                  <PlaceOutlinedIcon />
                </Button>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                  transformOrigin={{ vertical: "top", horizontal: "center" }}
                  className={s.popover}
                >
                  <GoogleMaps />
                </Popover>
              </div>
            )}
          </PopupState>
        </div>

        <div>
          <Slider
            aria-label="Miles"
            value={radius}
            getAriaValueText={(value) => `${value}`}
            valueLabelDisplay="auto"
            shiftStep={30}
            step={10}
            marks
            min={10}
            max={100}
            onChange={(_, value) => dispatch(setRadius(value as number))}
            className={s.slider}
          />
          <p className={s.text}>
            Show within: <b>{radius} miles</b>
          </p>
        </div>

        <div className={s.age}>
          <h4>Age</h4>
          <Slider
            getAriaLabel={() => "Age range"}
            value={ageRange}
            onChange={(_, value: number | number[]) => {
              if (Array.isArray(value)) {
                dispatch(setAgeRange(value));
              }
            }}
            valueLabelDisplay="auto"
            min={0}
            max={40}
          />
        </div>
        <List dense component="div" role="list" title="Filter by Breed">
          <h4>Breeds</h4>
          {breeds?.map((value: string) => {
            const labelId = `transfer-list-item-${value}-label`;

            return (
              <ListItemButton
                key={value}
                role="listitem"
                onClick={() =>
                  dispatch(
                    setBreeds(
                      selectedBreeds.includes(value)
                        ? selectedBreeds.filter((v) => v !== value)
                        : [...selectedBreeds, value]
                    )
                  )
                }
                className={s.list_item}
              >
                <ListItemIcon className={s.list_icon}>
                  <Checkbox
                    className={s.list_checkbox}
                    checked={selectedBreeds.includes(value)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value} />
              </ListItemButton>
            );
          })}
        </List>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => dispatch(resetFilters())}
          className={s.resetButton}
        >
          Reset Filters
        </Button>
      </CardLayout>
    </>
  );
}
