import { ProviderCityState } from "../entities/provider-city-state";
import { AppDataSource } from "../util/data-source";
import logger from "../util/logger";

export async function getProviderCityStates() {
  logger.info("Entering Location Service => getProviderCityStates");

  const results = await AppDataSource.manager.find(ProviderCityState);

  logger.info("Exiting Location Service => getProviderCityStates");
  return results;
}
