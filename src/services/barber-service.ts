import { Barber } from "../entities/barber";
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
  barberId: number,
  firstName: string,
  lastName: string,
  alias: string,
  bio: string,
  shop: string,
  addressLine1: string,
  addressLine2: string,
  city: string,
  state: string,
  zipCode: string,
) {
  logger.info("Entering Barber Service => updateBarberDetails");

  const barber = await AppDataSource.manager.findOne(Barber, {
    where: { id: barberId },
  });

  if (!barber) {
    throw new Error("Barber does not exist");
  }

  barber.firstName = firstName;
  barber.lastName = lastName;
  barber.alias = alias;
  barber.bio = bio;
  barber.shop = shop;
  barber.addressLine1 = addressLine1;
  barber.addressLine2 = addressLine2;
  barber.city = city;
  barber.state = state;
  barber.zipCode = zipCode;

  const updatedBarber = await AppDataSource.manager.save(barber);

  logger.info("Exiting Barber Service => updateBarberDetails");
  return {
    ...updatedBarber,
    formattedAddress: formatAddress(updatedBarber),
    fullName: getFullName(updatedBarber),
  };
}
