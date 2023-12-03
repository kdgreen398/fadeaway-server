const { executeSelectQuery } = require("../util/db/connection-util");
const {
  FETCH_BARBERS_BY_CITY_STATE,
  FETCH_IMAGES_BY_BARBER_ID,
  FETCH_AVERAGE_AND_TOTAL_REVIEWS_BY_BARBER_ID,
  FETCH_BARBER_DETAILS_BY_PUBLIC_ID,
  FETCH_REVIEWS_BY_BARBER_ID,
} = require("../util/db/queries");
const logger = require("../util/logger");
const ServiceManagementService = require("./service-management-service");

async function getBarbersByCityState(city, state) {
  logger.info("Entering Barber Service => getBarbersByCityState");

  // execute the query and return the results
  const barbers = await executeSelectQuery(FETCH_BARBERS_BY_CITY_STATE, [
    city,
    state,
  ]);

  const results = await Promise.all(
    barbers.map(async (barber) => {
      const imageQuery = FETCH_IMAGES_BY_BARBER_ID;
      const reviewQuery = FETCH_AVERAGE_AND_TOTAL_REVIEWS_BY_BARBER_ID;

      const [images, reviews] = await Promise.all([
        executeSelectQuery(imageQuery, [barber.barberId]),
        executeSelectQuery(reviewQuery, [barber.barberId]),
      ]);

      if (images.length === 0) {
        return null;
      }

      return {
        publicId: barber.publicId,
        name: barber.name,
        alias: barber.alias,
        shop: barber.shop,
        averageRating: reviews[0].averageRating,
        totalReviews: reviews[0].totalReviews,
        images,
      };
    }),
  );

  logger.info("Exiting Barber Service => getBarbersByCityState");
  return results.filter((result) => result !== null);
}

async function getBarberDetails(publicId) {
  logger.info("Entering Barber Service => getBarberDetails");
  const barber = (
    await executeSelectQuery(FETCH_BARBER_DETAILS_BY_PUBLIC_ID, [publicId])
  )[0];

  if (!barber) return null;

  const imageQuery = FETCH_IMAGES_BY_BARBER_ID;
  const reviewQuery = FETCH_REVIEWS_BY_BARBER_ID;

  const [images, reviews, services] = await Promise.all([
    executeSelectQuery(imageQuery, [barber.barberId]),
    executeSelectQuery(reviewQuery, [barber.barberId]),
    ServiceManagementService.getServices(barber.barberId),
  ]);

  logger.info("Exiting Barber Service => getBarberDetails");
  return {
    ...barber,
    formattedAddress: `${barber.addressLine1}${
      barber.addressLine2 ? " " + barber.addressLine2 : ""
    }, ${barber.city}, ${barber.state} ${barber.zipCode}`,
    images,
    reviews,
    services,
  };
}

module.exports = {
  getBarbersByCityState,
  getBarberDetails,
};
