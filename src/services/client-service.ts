import { In } from "typeorm";
import { Appointment } from "../entities/appointment";
import { Client } from "../entities/client";
import { AppointmentStatusEnum } from "../enums/appointment-status-enum";
import { AppDataSource } from "../util/data-source";
import logger from "../util/logger";

export async function deleteAccount(clientId: number) {
  logger.info("Entering Barber Service => deleteAccount");

  const client = await AppDataSource.manager.findOne(Client, {
    where: { id: clientId },
  });

  if (!client) {
    throw new Error("Barber does not exist");
  }

  // check if client has any appointments in pending or accepted state
  const appointments = await AppDataSource.manager.find(Appointment, {
    where: {
      client: {
        id: clientId,
      },
      status: In([
        AppointmentStatusEnum.ACCEPTED,
        AppointmentStatusEnum.PENDING,
      ]),
    },
  });

  if (appointments.length > 0) {
    throw new Error(
      "Client cannot delete account while having appointments in pending or accepted state",
    );
  }

  await AppDataSource.manager.delete(Client, clientId);

  logger.info("Exiting Client Service => deleteAccount");
}
