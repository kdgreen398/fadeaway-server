import { BarberCityState } from "../entities/barber-city-state";
import { AppDataSource } from "../util/data-source";
import logger from "../util/logger";

export async function getBarberCityStates() {
  logger.info("Entering Location Service => getBarberCityStates");

  const results = await AppDataSource.manager.find(BarberCityState);

  logger.info("Exiting Location Service => getBarberCityStates");
  return results;
}
