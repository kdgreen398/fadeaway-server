const e = require("express");
const {
  FETCH_APPOINTMENTS_BY_EMAIL,
  CREATE_APPOINTMENT,
  FETCH_APPOINTMENTS_BY_EMAIL_AND_STATUS,
} = require("../queries/appointment-queries");
const { FETCH_BARBER_BY_EMAIL } = require("../queries/barber-queries");
const { FETCH_CLIENT_BY_EMAIL } = require("../queries/client-queries");
const {
  executeSelectQuery,
  executeNonSelectQuery,
} = require("../util/connection-util");
const logger = require("../util/logger");
const AppointmentStatuses = require("../enums/appointment-status-enum");

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
      return false; // Overlapping appointment found
    }
  }
  return true; // No overlap found with existing appointments
}

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

  if (new Date(startTime) < new Date()) {
    throw new Error("Appointment time cannot be in the past");
  }

  // check client availability
  const clientAppointments = await executeSelectQuery(
    FETCH_APPOINTMENTS_BY_EMAIL_AND_STATUS,
    [clientEmail, clientEmail, AppointmentStatuses.PENDING],
  );

  // Check if the new appointment can be created
  if (!canCreateAppointment(clientAppointments, { startTime, endTime })) {
    throw new Error("You already have an appointment at that time");
  }

  // check barber availability
  const barberAppointments = await executeSelectQuery(
    FETCH_APPOINTMENTS_BY_EMAIL_AND_STATUS,
    [barberEmail, barberEmail, AppointmentStatuses.PENDING],
  );

  // Check if the new appointment can be created
  if (!canCreateAppointment(barberAppointments, { startTime, endTime })) {
    throw new Error("Appointment time is not available");
  }

  await executeNonSelectQuery(CREATE_APPOINTMENT, [
    client.clientId,
    barber.barberId,
    new Date(startTime),
    new Date(endTime),
    JSON.stringify(services),
  ]);

  logger.info("Exiting Appointment Service => createAppointment");
  return "success";
}

async function cancelAppointment(user, appointmentId) {
  logger.info("Entering Appointment Service => cancelAppointment");

  console.log(user, appointmentId);

  // check if user is client or barber
  const isClient = user.accountType === "client";

  // if client, update appointment status by appointment id and client id
  if (isClient) {
    await executeNonSelectQuery(UPDATE_APPT_STATUS_BY_APPT_ID_AND_CLIENT_ID, [
      AppointmentStatuses.CANCELLED,
      appointmentId,
      user.id,
    ]);
  } else {
    // if barber, update appointment status by appointment id and barber id
    await executeNonSelectQuery(UPDATE_APPT_STATUS_BY_APPT_ID_AND_BARBER_ID, [
      AppointmentStatuses.CANCELLED,
      appointmentId,
      user.id,
    ]);
  }

  logger.info("Exiting Appointment Service => cancelAppointment");
  return "success";
}

module.exports = {
  createAppointment,
  getAppointments,
  cancelAppointment,
};
