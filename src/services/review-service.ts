import { Client } from "../entities/client";
import { Provider } from "../entities/provider";
import { Review } from "../entities/review";
import { AppointmentStatusEnum } from "../enums/appointment-status-enum";
import { AppDataSource } from "../util/data-source";
import logger from "../util/logger";

export async function createReview(
  rating: number,
  description: string,
  providerId: number,
  clientId: number,
) {
  logger.info("Entering Review Service => createReview");

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const provider = await AppDataSource.manager.findOne(Provider, {
    where: {
      id: providerId,
    },
  });

  if (!provider) {
    throw new Error("Provider does not exist");
  }

  const client = await AppDataSource.manager.findOne(Client, {
    where: {
      id: clientId,
    },
    relations: {
      appointments: {
        provider: true,
      },
    },
  });

  if (!client) {
    throw new Error("Client does not exist");
  }

  // if client does not have completed appointment with provider
  // throw error
  if (
    !client.appointments.find(
      (appt) =>
        appt.provider.id === providerId &&
        appt.status === AppointmentStatusEnum.COMPLETED,
    )
  ) {
    throw new Error("Client does not have completed appointment with provider");
  }

  logger.info("Exiting Review Service => createReview");
  return await AppDataSource.manager.save(Review, {
    rating,
    description,
    dateCreated: new Date(),
    provider,
    client,
  });
}
