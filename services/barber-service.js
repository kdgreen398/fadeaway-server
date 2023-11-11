const { executeSelectQuery } = require("../util/db/connection-util");
const {
  FETCH_BARBERS_BY_CITY_STATE,
  FETCH_IMAGES_BY_BARBER_ID,
  FETCH_AVERAGE_AND_TOTAL_REVIEWS_BY_BARBER_ID,
} = require("../util/db/queries");
const logger = require("../util/logger");

module.exports = {
  getBarbersByCityState: async (city, state) => {
    logger.info("Entering Barber Service => getBarbersByCityState");
    const barberQuery = FETCH_BARBERS_BY_CITY_STATE;

    // execute the query and return the results
    // convert to inner join query with images and reviews
    const barbers = await executeSelectQuery(barberQuery, [city, state]);

    const results = await Promise.all(
      barbers.map(async (barber) => {
        const imageQuery = FETCH_IMAGES_BY_BARBER_ID;
        const reviewQuery = FETCH_AVERAGE_AND_TOTAL_REVIEWS_BY_BARBER_ID;

        const [images, reviews] = await Promise.all([
          executeSelectQuery(imageQuery, [barber.barberId]),
          executeSelectQuery(reviewQuery, [barber.barberId]),
        ]);

        return {
          publicId: barber.publicId,
          barberName: barber.name,
          alias: barber.alias,
          shopName: barber.shop,
          averageRating: reviews[0].averageRating,
          totalReviews: reviews[0].totalReviews,
          images,
        };
      }),
    );

    logger.info("Exiting Barber Service => getBarbersByCityState");
    return results;
  },
};
