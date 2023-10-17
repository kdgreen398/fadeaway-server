const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});

module.exports = {
  getAddressFromCoords: async (lat, lng) => {
    const googleAPIResponse = await client.reverseGeocode({
      params: {
        latlng: { lat, lng },
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    return googleAPIResponse.data.results[0].formatted_address;
  },
};
