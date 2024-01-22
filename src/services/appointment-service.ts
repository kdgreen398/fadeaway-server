import { Appointment } from "../entities/appointment";
import { Client } from "../entities/client";
import { Provider } from "../entities/provider";
import { Service } from "../entities/service";
import { AppointmentStatusEnum } from "../enums/appointment-status-enum";
import { RoleEnum } from "../enums/role-enum";
import { allowedStatusChanges } from "../util/appointment-status-validation";
import { AppDataSource } from "../util/data-source";
import { DecodedToken } from "../util/jwt";
import logger from "../util/logger";

// Function to check for overlapping appointments
function doesOverlap(
  existingAppointment: Appointment,
  startTime: Date,
  endTime: Date,
) {
  return (
    new Date(existingAppointment.startTime) < new Date(endTime) &&
    new Date(startTime) < new Date(existingAppointment.endTime)
  );
}

// Function to validate new appointment against existing appointments
function canCreateAppointment(
  existingAppointments: Appointment[],
  startTime: Date,
  endTime: Date,
) {
  for (const existing of existingAppointments) {
    if (doesOverlap(existing, startTime, endTime)) {
      return false; // Overlapping appointment found
    }
  }
  return true; // No overlap found with existing appointments
}

export async function getAppointments(email: string, accountType: string) {
  logger.info("Entering Appointment Service => getAppointments");

  // If user is a client, return appointments where client id matches
  let appointments = [];
  if (accountType === RoleEnum.client) {
    appointments = await AppDataSource.manager.find(Appointment, {
      where: {
        client: {
          email: email,
        },
      },
      relations: { provider: true, client: true },
    });
  } else {
    appointments = await AppDataSource.manager.find(Appointment, {
      where: {
        provider: {
          email: email,
        },
      },
      relations: { provider: true, client: true },
    });
  }

  logger.info("Exiting Appointment Service => getAppointments");
  return appointments;
}

export async function createAppointment(
  clientEmail: string,
  providerEmail: string,
  startTime: Date,
  services: Service[],
) {
  logger.info("Entering Appointment Service => createAppointment");

  const totalHours = services.reduce((acc, curr) => acc + curr.hours, 0);
  const totalMinutes = services.reduce((acc, curr) => acc + curr.minutes, 0);
  // endtime calculated from start time and services
  const endTime = new Date(startTime);

  endTime.setHours(endTime.getHours() + totalHours);
  endTime.setMinutes(endTime.getMinutes() + totalMinutes);

  const clientAppointments = await AppDataSource.manager.find(Appointment, {
    where: {
      client: {
        email: clientEmail,
      },
      status: AppointmentStatusEnum.PENDING || AppointmentStatusEnum.ACCEPTED,
    },
  });

  // Check if the new appointment can be created
  if (!canCreateAppointment(clientAppointments, startTime, endTime)) {
    throw new Error("You already have an appointment at that time");
  }

  const providerAppointments = await AppDataSource.manager.find(Appointment, {
    where: {
      provider: {
        email: providerEmail,
      },
      status: AppointmentStatusEnum.PENDING || AppointmentStatusEnum.ACCEPTED,
    },
  });

  // Check if the new appointment can be created
  if (!canCreateAppointment(providerAppointments, startTime, endTime)) {
    throw new Error("Appointment time is not available");
  }

  const provider = await AppDataSource.manager.findOne(Provider, {
    where: { email: providerEmail },
  });

  const client = await AppDataSource.manager.findOne(Client, {
    where: { email: clientEmail },
  });

  if (!provider || !client) {
    throw new Error("Provider or client not found");
  }

  // Create new appointment
  const createdAppointment = await AppDataSource.manager.save(
    Appointment,
    Appointment.create({
      startTime,
      endTime,
      services,
      createdTime: new Date(),
      updatedBy: RoleEnum.client,
      updatedTime: new Date(),
      provider,
      client,
    }),
  );

  logger.info("Exiting Appointment Service => createAppointment");
  return createdAppointment;
}

export async function updateAppointmentStatus(
  appointmentId: number,
  status: AppointmentStatusEnum,
  updatedBy: DecodedToken,
) {
  logger.info("Entering Appointment Service => updateAppointmentStatus");
  // check if user is client or provider
  const isClient = updatedBy.accountType === RoleEnum.client;

  // if client, update appointment status by appointment id and client id
  // if provider, update appointment status by appointment id and provider id

  const appointment = await AppDataSource.manager.findOne(Appointment, {
    where: {
      id: appointmentId,
      [isClient ? RoleEnum.client : RoleEnum.provider]: {
        id: updatedBy.id,
      },
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (isClient && appointment.client.id !== updatedBy.id) {
    throw new Error("Unauthorized");
  }

  if (!isClient && appointment.provider.id !== updatedBy.id) {
    throw new Error("Unauthorized");
  }

  if (!allowedStatusChanges[appointment.status].includes(status)) {
    throw new Error("Invalid status from validation");
  }

  appointment.status = status;
  appointment.updatedBy = isClient ? RoleEnum.client : RoleEnum.provider;
  appointment.updatedTime = new Date();

  logger.info("Exiting Appointment Service => updateAppointmentStatus");
  return await AppDataSource.manager.save(Appointment, appointment);
}

export async function cancelAppointment(
  user: DecodedToken,
  appointmentId: number,
) {
  logger.info("Entering Appointment Service => cancelAppointment");

  // check if user is client or provider
  const isClient = user.accountType === RoleEnum.client;

  // if client, update appointment status by appointment id and client id
  // if provider, update appointment status by appointment id and provider id

  const appointment = await AppDataSource.manager.findOne(Appointment, {
    where: {
      id: appointmentId,
      [isClient ? "client" : "provider"]: {
        id: user.id,
      },
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  appointment.status = AppointmentStatusEnum.CANCELED;
  appointment.updatedBy = isClient ? RoleEnum.client : RoleEnum.provider;
  appointment.updatedTime = new Date();

  const updatedAppointment = await AppDataSource.manager.save(
    Appointment,
    appointment,
  );
  logger.info("Exiting Appointment Service => cancelAppointment");
  return updatedAppointment;
}
