const {
  executeNonSelectQuery,
  executeSelectQuery,
} = require("../util/db/connection-util");
const {
  CREATE_SERVICE,
  UPDATE_SERVICE,
  FETCH_SERVICE_BY_SERVICE_ID_AND_BARBER_ID,
  DELETE_SERVICE_BY_SERVICE_ID_AND_BARBER_ID,
  FETCH_SERVICE_COUNT_BY_BARBER_ID,
  FETCH_SERVICES_BY_BARBER_ID,
} = require("../util/db/queries");
const logger = require("../util/logger");

async function getServices(barberId) {
  logger.info("Entering Service Management Service => getServices");

  const services = await executeSelectQuery(FETCH_SERVICES_BY_BARBER_ID, [
    barberId,
  ]);

  logger.info("Exiting Service Management Service => getServices");
  return services;
}

async function createService(name, hours, minutes, description, price, id) {
  logger.info("Entering Service Management Service => createService");

  // if user has more than 6 services, throw error
  const [{ serviceCount }] = await executeSelectQuery(
    FETCH_SERVICE_COUNT_BY_BARBER_ID,
    [id],
  );

  if (serviceCount >= 6) {
    throw new Error("You have reached the maximum number of services");
  }

  await executeNonSelectQuery(CREATE_SERVICE, [
    name,
    hours,
    minutes,
    description,
    price,
    id,
  ]);

  logger.info("Exiting Service Management Service => createService");
  return "Service created successfully";
}

async function updateService(
  name,
  hours,
  minutes,
  description,
  price,
  serviceId,
  barberId,
) {
  logger.info("Entering Service Management Service => updateService");

  const [service] = await executeSelectQuery(
    FETCH_SERVICE_BY_SERVICE_ID_AND_BARBER_ID,
    [serviceId, barberId],
  );

  if (!service) {
    throw new Error("Service does not exist");
  }

  await executeNonSelectQuery(UPDATE_SERVICE, [
    name,
    hours,
    minutes,
    description,
    price,
    serviceId,
    barberId,
  ]);

  logger.info("Exiting Service Management Service => updateService");
  return "Service updated successfully";
}

async function deleteService(serviceId, barberId) {
  logger.info("Entering Service Management Service => deleteService");

  const [service] = await executeSelectQuery(
    FETCH_SERVICE_BY_SERVICE_ID_AND_BARBER_ID,
    [serviceId, barberId],
  );

  if (!service) {
    throw new Error("Service does not exist");
  }

  await executeNonSelectQuery(DELETE_SERVICE_BY_SERVICE_ID_AND_BARBER_ID, [
    serviceId,
    barberId,
  ]);

  logger.info("Exiting Service Management Service => deleteService");
  return "Service deleted successfully";
}

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};
