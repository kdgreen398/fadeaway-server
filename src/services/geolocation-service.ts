import { Client } from "@googlemaps/google-maps-services-js";
import logger from "../util/logger";

const client = new Client({});

export async function getAddressFromCoords(lat: string, lng: string) {
  logger.info("Entering Geolocation Service => getAddressFromCoords");
  const googleAPIResponse = await client.reverseGeocode({
    params: {
      latlng: { lat: parseFloat(lat), lng: parseFloat(lng) },
      key: process.env.GOOGLE_MAPS_API_KEY || "",
    },
  });

  const address = googleAPIResponse.data.results[0].formatted_address;
  logger.info("Exiting Geolocation Service => getAddressFromCoords");
  return address;
}
