const {
  FETCH_APPOINTMENTS_BY_EMAIL,
} = require("../queries/appointment-queries");
const { executeSelectQuery } = require("../util/connection-util");
const logger = require("../util/logger");

async function getAppointments(email, accountType) {
  logger.info("Entering Appointment Service => getAppointments");

  const appointments = await executeSelectQuery(FETCH_APPOINTMENTS_BY_EMAIL, [
    email,
    email,
  ]);

  logger.info("Exiting Appointment Service => getAppointments");
  return appointments.map((appt) => ({
    appointmentId: appt.appointmentId,
    startTime: appt.startTime,
    endTime: appt.endTime,
    services: appt.services,
    status: appt.status,
    barber: {
      name: appt.barberName,
      alias: appt.barberAlias,
      email: appt.email,
      publicId: appt.barberPublicId,
      profileImage: appt.profileImage,
    },
    client: {
      name: appt.clientName,
      email: appt.clientEmail,
    },
    shop: {
      name: appt.shop,
      addressLine1: appt.addressLine1,
      addressLine2: appt.addressLine2,
      city: appt.city,
      state: appt.state,
      zipCode: appt.zipCode,
      formattedAddress: `${appt.addressLine1} ${appt.addressLine2}, ${appt.city}, ${appt.state} ${appt.zipCode}`,
    },
  }));
}

module.exports = {
  getAppointments,
};
