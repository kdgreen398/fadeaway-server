const { executeSelectQuery } = require("../util/db/connection-util");
const {
  FETCH_BARBERS_BY_CITY_STATE,
  FETCH_IMAGES_BY_BARBER_ID,
  FETCH_REVIEWS_BY_BARBER_ID,
} = require("../util/db/queries");
const logger = require("../util/logger");

module.exports = {
  getBarbersByCityState: async (city, state) => {
    logger.info("Entering Barber Service => getBarbersByCityState");
    const barberQuery = FETCH_BARBERS_BY_CITY_STATE;

    // execute the query and return the results
    const barbers = await executeSelectQuery(barberQuery, [city, state]);

    const results = await Promise.all(
      barbers.map(async (barber) => {
        const imageQuery = FETCH_IMAGES_BY_BARBER_ID;
        const reviewQuery = FETCH_REVIEWS_BY_BARBER_ID;

        const [images, reviews] = await Promise.all([
          executeSelectQuery(imageQuery, [barber.barberId]),
          executeSelectQuery(reviewQuery, [barber.barberId]),
        ]);

        return {
          barberName: `${barber.firstName} ${barber.lastName}`,
          alias: barber.alias,
          shopName: barber.shop,
          images,
          reviews,
        };
      })
    );

    logger.info("Exiting Barber Service Successfully => getBarbersByCityState");
    return results;
  },
};
