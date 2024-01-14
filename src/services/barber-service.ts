import { In } from "typeorm";
import { Appointment } from "../entities/appointment";
import { Barber } from "../entities/barber";
import { AppointmentStatuses } from "../enums/appointment-status-enum";
import * as ImageService from "../services/image-service";
import { AppDataSource } from "../util/data-source";
import logger from "../util/logger";

const formatAddress = (barber: Barber) =>
  `${barber.addressLine1}${
    barber.addressLine2 ? " " + barber.addressLine2 : ""
  }, ${barber.city}, ${barber.state} ${barber.zipCode}`;

const getFullName = (barber: Barber) =>
  `${barber.firstName} ${barber.lastName}`.trim();

export async function getBarbersByCityState(city: string, state: string) {
  logger.info("Entering Barber Service => getBarbersByCityState");

  const barbers = await AppDataSource.manager.find(Barber, {
    where: { city, state },
    relations: {
      images: true,
      reviews: true,
    },
  });

  logger.info("Exiting Barber Service => getBarbersByCityState");
  return barbers;
}

export async function getBarberProfileData(barberId: number) {
  logger.info("Entering Barber Service => getBarberDetails");

  const barber = await AppDataSource.manager.findOne(Barber, {
    where: { id: barberId },
    relations: {
      images: true,
      reviews: true,
      services: true,
    },
  });

  if (!barber) {
    throw new Error("Barber does not exist");
  }

  logger.info("Exiting Barber Service => getBarberDetails");
  return {
    ...barber,
    formattedAddress: formatAddress(barber),
    fullName: getFullName(barber),
  };
}

export async function updateBarberDetails(
  barberToSave: Barber,
  imageFile: Express.Multer.File | undefined,
) {
  logger.info("Entering Barber Service => updateBarberDetails");

  const barber = await AppDataSource.manager.findOne(Barber, {
    where: { id: barberToSave.id },
  });

  if (!barber) {
    throw new Error("Barber does not exist");
  }

  if (imageFile) {
    barber.profileImage = await ImageService.uploadBarberProfileImage(
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

  const updatedBarber = await AppDataSource.manager.save(barber);

  logger.info("Exiting Barber Service => updateBarberDetails");
  return {
    ...updatedBarber,
    formattedAddress: formatAddress(updatedBarber),
    fullName: getFullName(updatedBarber),
  };
}

export async function deleteBarberAccount(barberId: number) {
  logger.info("Entering Barber Service => deleteBarberAccount");

  const barber = await AppDataSource.manager.findOne(Barber, {
    where: { id: barberId },
  });

  if (!barber) {
    throw new Error("Barber does not exist");
  }

  // check if barber has any appointments in pending or accepted state
  const appointments = await AppDataSource.manager.find(Appointment, {
    where: {
      barber: {
        id: barberId,
      },
      status: In([AppointmentStatuses.ACCEPTED, AppointmentStatuses.PENDING]),
    },
  });

  if (appointments.length > 0) {
    throw new Error(
      "Barber cannot delete account while having appointments in pending or accepted state",
    );
  }

  await AppDataSource.manager.delete(Barber, barberId);

  logger.info("Exiting Barber Service => deleteBarberAccount");
}
