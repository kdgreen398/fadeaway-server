const { Client } = require("@googlemaps/google-maps-services-js");
const logger = require("../util/logger");

const client = new Client({});

export async function getAddressFromCoords(lat, lng) {
  logger.info("Entering Geolocation Service => getAddressFromCoords");
  const googleAPIResponse = await client.reverseGeocode({
    params: {
      latlng: { lat, lng },
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });

  const address = googleAPIResponse.data.results[0].formatted_address;
  logger.info("Exiting Geolocation Service => getAddressFromCoords");
  return address;
}

module.exports = {
  getAddressFromCoords,
};