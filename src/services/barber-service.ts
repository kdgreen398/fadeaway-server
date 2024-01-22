import { In } from "typeorm";
import { Appointment } from "../entities/appointment";
import { Provider } from "../entities/barber";
import { AppointmentStatusEnum } from "../enums/appointment-status-enum";
import * as ImageService from "../services/image-service";
import { AppDataSource } from "../util/data-source";
import logger from "../util/logger";

const formatAddress = (barber: Provider) =>
  `${barber.addressLine1}${
    barber.addressLine2 ? " " + barber.addressLine2 : ""
  }, ${barber.city}, ${barber.state} ${barber.zipCode}`;

const getFullName = (barber: Provider) =>
  `${barber.firstName} ${barber.lastName}`.trim();

export async function getProvidersByCityState(city: string, state: string) {
  logger.info("Entering Provider Service => getProvidersByCityState");

  const barbers = await AppDataSource.manager.find(Provider, {
    where: { city, state },
    relations: {
      images: true,
      reviews: true,
    },
  });

  logger.info("Exiting Provider Service => getProvidersByCityState");
  return barbers;
}

export async function getProviderProfileData(barberId: number) {
  logger.info("Entering Provider Service => getProviderDetails");

  const barber = await AppDataSource.manager.findOne(Provider, {
    where: { id: barberId },
    relations: {
      images: true,
      reviews: true,
      services: true,
    },
  });

  if (!barber) {
    throw new Error("Provider does not exist");
  }

  logger.info("Exiting Provider Service => getProviderDetails");
  return {
    ...barber,
    formattedAddress: formatAddress(barber),
    fullName: getFullName(barber),
  };
}

export async function updateProviderDetails(
  barberToSave: Provider,
  imageFile: Express.Multer.File | undefined,
) {
  logger.info("Entering Provider Service => updateProviderDetails");

  const barber = await AppDataSource.manager.findOne(Provider, {
    where: { id: barberToSave.id },
  });

  if (!barber) {
    throw new Error("Provider does not exist");
  }

  if (imageFile) {
    barber.profileImage = await ImageService.uploadProviderProfileImage(
      imageFile,
      barber.id,
    );
  }

  barber.firstName = barberToSave.firstName;
  barber.lastName = barberToSave.lastName;
  barber.alias = barberToSave.alias;
  barber.bio = barberToSave.bio;
  barber.shop = barberToSave.shop;
  barber.addressLine1 = barberToSave.addressLine1;
  barber.addressLine2 = barberToSave.addressLine2;
  barber.city = barberToSave.city;
  barber.state = barberToSave.state;
  barber.zipCode = barberToSave.zipCode;

  const updatedProvider = await AppDataSource.manager.save(barber);

  logger.info("Exiting Provider Service => updateProviderDetails");
  return {
    ...updatedProvider,
    formattedAddress: formatAddress(updatedProvider),
    fullName: getFullName(updatedProvider),
  };
}

export async function deleteProviderAccount(barberId: number) {
  logger.info("Entering Provider Service => deleteProviderAccount");

  const barber = await AppDataSource.manager.findOne(Provider, {
    where: { id: barberId },
  });

  if (!barber) {
    throw new Error("Provider does not exist");
  }

  // check if barber has any appointments in pending or accepted state
  const appointments = await AppDataSource.manager.find(Appointment, {
    where: {
      barber: {
        id: barberId,
      },
      status: In([
        AppointmentStatusEnum.ACCEPTED,
        AppointmentStatusEnum.PENDING,
      ]),
    },
  });

  if (appointments.length > 0) {
    throw new Error(
      "Provider cannot delete account while having appointments in pending or accepted state",
    );
  }

  await AppDataSource.manager.delete(Provider, barberId);

  logger.info("Exiting Provider Service => deleteProviderAccount");
}
