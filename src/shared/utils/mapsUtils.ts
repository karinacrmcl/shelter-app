const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const getAddressFromZip = async (
  zipCode: string
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      console.warn("No results found for ZIP code:", zipCode);
      return null;
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
};

const EARTH_RADIUS_MILES = 3958.8; // Earth radius in miles

export const getBoundingBox = (lat: number, lon: number, radius: number) => {
  const latChange = (radius / EARTH_RADIUS_MILES) * (180 / Math.PI);
  const lonChange = latChange / Math.cos((lat * Math.PI) / 180);

  return {
    top: lat + latChange,
    bottom: lat - latChange,
    left: lon - lonChange,
    right: lon + lonChange,
  };
};
