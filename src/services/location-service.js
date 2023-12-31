const { executeSelectQuery } = require("../util/connection-util");
const {
  FETCH_ALL_BARBER_CITY_STATES,
} = require("../queries/barber-city-state-queries");
const logger = require("../util/logger");

async function getBarberCityStates() {
  logger.info("Entering Location Service => getBarberCityStates");

  const results = await executeSelectQuery(FETCH_ALL_BARBER_CITY_STATES);

  logger.info("Exiting Location Service => getBarberCityStates");
  return results;
}

module.exports = {
  getBarberCityStates,
};
