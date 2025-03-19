import React, { useEffect, useId, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLocation } from "../../store/slices/filtersSlice"; // Ensure the path is correct
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Paper, { PaperProps } from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import { throttle } from "lodash";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const useEnhancedEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function loadScript(src: string, position: HTMLElement) {
  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.src = src;
  position.appendChild(script);
  return script;
}

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
  secondary_text?: string;
}
interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
}

function CustomPaper(props: PaperProps) {
  const theme = useTheme();

  return (
    <Paper {...props}>
      {props.children}
      <Box
        sx={(staticTheme) => ({
          display: "flex",
          justifyContent: "flex-end",
          p: 1,
          pt: "1px",
          ...staticTheme.applyStyles("dark", {
            opacity: 0.8,
          }),
        })}
      >
        <img
          src={
            theme.palette.mode === "dark"
              ? "https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white3_hdpi.png"
              : "https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3_hdpi.png"
          }
          alt=""
          width="120"
          height="14"
        />
      </Box>
    </Paper>
  );
}

const fetchPlaces = throttle(
  async (
    request: { input: string; sessionToken: any },
    callback: (results?: readonly PlaceType[]) => void
  ) => {
    try {
      const { suggestions } = await (
        window as any
      ).google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
        request
      );

      callback(
        suggestions.map((suggestion: any) => {
          const place = suggestion.placePrediction;

          return {
            description: place.text.text,
            structured_formatting: {
              main_text: place.mainText.text,
              main_text_matched_substrings: place.mainText.matches.map(
                (match: any) => ({
                  offset: match.startOffset,
                  length: match.endOffset - match.startOffset,
                })
              ),
              secondary_text: place.secondaryText?.text,
            },
          };
        })
      );
    } catch (err: any) {
      throw err;
    }
  },
  400
);

const emptyOptions = [] as any;
let sessionToken: any;

export default function GoogleMaps() {
  const dispatch = useDispatch();
  const [value, setValue] = useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly PlaceType[]>(emptyOptions);
  const callbackId = useId().replace(/:/g, "");
  const [loaded, setLoaded] = useState(false);

  if (typeof window !== "undefined") {
    if (!document.querySelector("#google-maps")) {
      const GOOGLE_NAMESPACE = "_google_callback";
      const globalContext =
        // @ts-ignore
        window[GOOGLE_NAMESPACE] || (window[GOOGLE_NAMESPACE] = {});
      globalContext[callbackId] = () => {
        setLoaded(true);
      };

      const script = loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&callback=${GOOGLE_NAMESPACE}.${callbackId}`,
        document.querySelector("head")!
      );
      script.id = "google-maps";
    } else if ((window as any).google && !loaded) {
      setLoaded(true);
    }
  }

  useEnhancedEffect(() => {
    if (!loaded) return;

    if (inputValue === "") {
      setOptions(value ? [value] : emptyOptions);
      return;
    }

    let active = true;

    if (!sessionToken) {
      sessionToken = new (
        window as any
      ).google.maps.places.AutocompleteSessionToken();
    }

    fetchPlaces(
      { input: inputValue, sessionToken },
      (results?: readonly PlaceType[]) => {
        if (!active) return;

        let newOptions: readonly PlaceType[] = results ? results : emptyOptions;

        if (value) {
          newOptions = [
            value,
            ...results!.filter(
              (result) => result.description !== value.description
            ),
          ];
        }

        setOptions(newOptions);
      }
    );

    return () => {
      active = false;
    };
  }, [value, inputValue, loaded]);

  const handleSelectLocation = async (newValue: PlaceType | null) => {
    setValue(newValue);
    setOptions(newValue ? [newValue, ...options] : options);

    if (newValue) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            newValue.description
          )}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();

        if (data.results.length > 0) {
          const addressComponents = data.results[0].address_components;
          const zipCodeComponent = addressComponents.find((component: any) =>
            component.types.includes("postal_code")
          );
          const cityComponent = addressComponents.find((component: any) =>
            component.types.includes("locality")
          );
          const stateComponent = addressComponents.find((component: any) =>
            component.types.includes("administrative_area_level_1")
          );

          const zipCode = zipCodeComponent?.long_name || null;
          const city = cityComponent?.long_name || null;
          const state = stateComponent?.short_name || null;
          const coordinates = {
            lat: data.results[0].geometry.location.lat,
            lon: data.results[0].geometry.location.lng,
          };

          dispatch(
            setLocation({
              zipCode,
              city,
              state,
              coordinates,
            })
          );
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: 300 }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      slots={{
        paper: CustomPaper,
      }}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No locations"
      onChange={(_, newValue) => handleSelectLocation(newValue)}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Add a location" fullWidth />
      )}
    />
  );
}
