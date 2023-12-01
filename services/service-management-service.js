const {
  executeNonSelectQuery,
  executeUpdateQuery,
  executeSelectQuery,
} = require("../util/db/connection-util");
const {
  CREATE_SERVICE,
  UPDATE_SERVICE,
  FETCH_SERVICE_BY_SERVICE_ID_AND_BARBER_ID,
  DELETE_SERVICE_BY_SERVICE_ID_AND_BARBER_ID,
} = require("../util/db/queries");
const logger = require("../util/logger");

async function createService(name, length, description, price, id) {
  logger.info("Entering Service Management Service => createService");

  await executeNonSelectQuery(CREATE_SERVICE, [
    name,
    length,
    description,
    price,
    id,
  ]);

  logger.info("Exiting Service Management Service => createService");
  return "Service created successfully";
}

async function updateService(
  name,
  length,
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
    length,
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
  createService,
  updateService,
  deleteService,
};
