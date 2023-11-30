const { executeInsertQuery } = require("../util/db/connection-util");
const { CREATE_SERVICE } = require("../util/db/queries");
const logger = require("../util/logger");

async function createService(name, length, description, price, id) {
  logger.info("Entering Service Management Service => createService");

  await executeInsertQuery(CREATE_SERVICE, [
    name,
    length,
    description,
    price,
    id,
  ]);

  logger.info("Exiting Service Management Service => createService");
  return "Service created successfully";
}

module.exports = {
  createService,
};
