import logger from "../util/logger";
import bcrypt from "bcrypt";
import { Client } from "../entities/client";
import { AppDataSource } from "../util/data-source";
import { Barber } from "../entities/barber";

const saltRounds = 10;

async function checkEmailExists(email: string) {
  const client = await AppDataSource.manager.findOne(Client, {
    where: { email },
  });
  const barber = await AppDataSource.manager.findOne(Barber, {
    where: { email },
  });

  return Boolean(client || barber);
}

export async function createClientInDB(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) {
  logger.info("Entering Registration Service => createClientInDB");

  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const client = Client.create(firstName, lastName, email, hashedPassword);

  const createdClient = await AppDataSource.manager.save(client);

  logger.info("Exiting Registration Service => createClientInDB");
  return createdClient;
}

export async function createBarberInDB(barberObj: Barber) {
  logger.info("Entering Registration Service => createBarberInDB");

  const emailExists = await checkEmailExists(barberObj.email);
  if (emailExists) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(barberObj.password, saltRounds);

  const barber = Barber.create(
    barberObj.firstName,
    barberObj.lastName,
    barberObj.email,
    hashedPassword,
    barberObj.shop,
    barberObj.addressLine1,
    barberObj.addressLine2,
    barberObj.city,
    barberObj.state,
    barberObj.zipCode,
  );

  const createdBarber = await AppDataSource.manager.save(barber);

  logger.info("Exiting Registration Service => createBarberInDB");
  return createdBarber;
}
