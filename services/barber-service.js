const { Client } = require("@googlemaps/google-maps-services-js");
const { executeQuery } = require("../util/db/connection-util");
const {
  FETCH_BARBERS_BY_CITY_STATE,
  FETCH_IMAGES_BY_BARBER_ID,
  FETCH_REVIEWS_BY_BARBER_ID,
} = require("../util/db/queries");

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

    const barberQuery = FETCH_BARBERS_BY_CITY_STATE;

    // execute the query and return the results
    const barbers = await executeQuery(barberQuery, [city, state]);

    const results = await Promise.all(
      barbers.map(async (barber) => {
        const imageQuery = FETCH_IMAGES_BY_BARBER_ID;
        const reviewQuery = FETCH_REVIEWS_BY_BARBER_ID;

        const [images, reviews] = await Promise.all([
          executeQuery(imageQuery, [barber.userId]),
          executeQuery(reviewQuery, [barber.userId]),
        ]);

        return {
          barberName: `${barber.firstName} ${barber.lastName}`,
          shopName: barber.shop,
          images,
          reviews,
        };
      })
    );

    return results;
  },
};
