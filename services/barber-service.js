const { Client } = require("@googlemaps/google-maps-services-js");
const { executeQuery } = require("../util/db/connection-util");

const client = new Client({});

module.exports = {
  getBarbersByLocation: async (lat, lng) => {
    const googleAPIResponse = await client.reverseGeocode({
      params: {
        latlng: { lat, lng },
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const address = googleAPIResponse.data.results[0].formatted_address;
    const city = address.split(",")[1].trim();
    const state = address.split(",")[2].split(" ")[1];

    const query = `SELECT * FROM USERS WHERE CITY = "${city}" AND STATE = "${state}"`;

    // execute the query and return the results
    const results = await executeQuery(query);

    return results;
  },
};
