const e = require("express");
const {
  FETCH_APPOINTMENTS_BY_EMAIL,
  CREATE_APPOINTMENT,
} = require("../queries/appointment-queries");
const { FETCH_BARBER_BY_EMAIL } = require("../queries/barber-queries");
const { FETCH_CLIENT_BY_EMAIL } = require("../queries/client-queries");
const {
  executeSelectQuery,
  executeNonSelectQuery,
} = require("../util/connection-util");
const logger = require("../util/logger");

async function getAppointments(email) {
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

async function createAppointment(
  clientEmail,
  barberEmail,
  startTime,
  services,
) {
  logger.info("Entering Appointment Service => createAppointment");

  const [client] = await executeSelectQuery(FETCH_CLIENT_BY_EMAIL, [
    clientEmail,
  ]);
  const [barber] = await executeSelectQuery(FETCH_BARBER_BY_EMAIL, [
    barberEmail,
  ]);

  const totalHours = services.reduce((acc, curr) => acc + curr.hours, 0);
  const totalMinutes = services.reduce((acc, curr) => acc + curr.minutes, 0);
  // endtime calculated from start time and services
  const endTime = new Date(startTime);

  endTime.setHours(endTime.getHours() + totalHours);
  endTime.setMinutes(endTime.getMinutes() + totalMinutes);

  // check if appointment time is available
  // if not, throw error
  // else, create appointment
  // return appointment

  const existingAppointments = await executeSelectQuery(
    FETCH_APPOINTMENTS_BY_EMAIL,
    [barberEmail, barberEmail],
  );
  // Function to check for overlapping appointments
  function doesOverlap(existingAppointment, newAppointment) {
    return (
      new Date(existingAppointment.startTime) <
        new Date(newAppointment.endTime) &&
      new Date(newAppointment.startTime) < new Date(existingAppointment.endTime)
    );
  }

  // Function to validate new appointment against existing appointments
  function canCreateAppointment(existingAppointments, newAppointment) {
    for (const existing of existingAppointments) {
      if (doesOverlap(existing, newAppointment)) {
        console.log(
          "new: ",
          new Date(newAppointment.startTime),
          "-",
          newAppointment.endTime,
        );
        console.log("existing: ", existing.startTime, "-", existing.endTime);
        return false; // Overlapping appointment found
      }
    }
    return true; // No overlap found with existing appointments
  }

  let message;

  // Check if the new appointment can be created
  if (canCreateAppointment(existingAppointments, { startTime, endTime })) {
    message = "success.";
  } else {
    message = "Cannot create.";
  }

  // await executeNonSelectQuery(CREATE_APPOINTMENT, [
  //   client.clientId,
  //   barber.barberId,
  //   startTime,
  //   endTime,
  //   services,
  // ]);

  logger.info("Exiting Appointment Service => createAppointment");
  return message;
}

module.exports = {
  createAppointment,
  getAppointments,
};
