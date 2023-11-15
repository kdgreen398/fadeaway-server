const { executeSelectQuery } = require("../util/db/connection-util");
const { FETCH_APPOINTMENTS_BY_CLIENT_EMAIL } = require("../util/db/queries");
const logger = require("../util/logger");

async function getClientAppointments(client) {
  logger.info("Entering Appointment Service => getClientAppointments");

  const appointments = await executeSelectQuery(
    FETCH_APPOINTMENTS_BY_CLIENT_EMAIL,
    [client.email],
  );

  logger.info("Exiting Appointment Service => getClientAppointments");
  return appointments;
}

module.exports = {
  getClientAppointments,
};
