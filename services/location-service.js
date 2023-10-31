const { executeSelectQuery } = require("../util/db/connection-util");
const { FETCH_ALL_BARBER_CITY_STATES } = require("../util/db/queries");
const logger = require("../util/logger");

module.exports = {
  getBarberCityStates: async () => {
    logger.info("Entering Location Service => getBarberCityStates");

    const results = await executeSelectQuery(FETCH_ALL_BARBER_CITY_STATES);

    logger.info("Exiting Location Service Successfully => getBarberCityStates");
    return results;
  },
};
