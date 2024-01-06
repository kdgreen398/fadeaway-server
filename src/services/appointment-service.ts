import logger from "../util/logger";
import { AppointmentStatuses } from "../enums/appointment-status-enum";
import { AppDataSource } from "../util/data-source";
import { Appointment } from "../entities/appointment";

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

export async function getAppointments(email: string, accountType: string) {
  logger.info("Entering Appointment Service => getAppointments");

  // If user is a client, return appointments where client id matches
  let appointments = [];
  if (accountType === "client") {
    appointments = await AppDataSource.manager.find(Appointment, {
      where: {
        client: {
          email: email,
        },
      },
    });
  } else {
    appointments = await AppDataSource.manager.find(Appointment, {
      where: {
        barber: {
          email: email,
        },
      },
    });
  }

  logger.info("Exiting Appointment Service => getAppointments");
  return appointments;
}

export async function createAppointment(
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

export async function cancelAppointment(user, appointmentId) {
  logger.info("Entering Appointment Service => cancelAppointment");

  // check if user is client or barber
  const isClient = user.accountType === "client";

  // if client, update appointment status by appointment id and client id
  // if barber, update appointment status by appointment id and barber id
  const query = isClient
    ? UPDATE_APPT_STATUS_BY_APPT_ID_AND_CLIENT_ID
    : UPDATE_APPT_STATUS_BY_APPT_ID_AND_BARBER_ID;

  await executeNonSelectQuery(query, [
    AppointmentStatuses.CANCELED,
    appointmentId,
    user.id,
  ]);

  logger.info("Exiting Appointment Service => cancelAppointment");
  return "success";
}
