import bcrypt from "bcrypt";
import { Provider } from "../entities/barber";
import { ProviderCityState } from "../entities/barber-city-state";
import { Client } from "../entities/client";
import { AppDataSource } from "../util/data-source";
import logger from "../util/logger";

const saltRounds = 10;

async function checkEmailExists(email: string) {
  const client = await AppDataSource.manager.findOne(Client, {
    where: { email },
  });
  const barber = await AppDataSource.manager.findOne(Provider, {
    where: { email },
  });

  return Boolean(client || barber);
}

export async function createClientInDB(clientObj: Client) {
  logger.info("Entering Registration Service => createClientInDB");
  const { firstName, lastName, email, password } = clientObj;

  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const client = Client.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  const createdClient = await AppDataSource.manager.save(client);

  logger.info("Exiting Registration Service => createClientInDB");
  return createdClient;
}

export async function createProviderInDB(barber: Provider) {
  logger.info("Entering Registration Service => createProviderInDB");

  const emailExists = await checkEmailExists(barber.email);
  if (emailExists) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(barber.password, saltRounds);

  barber.password = hashedPassword;
  const createdProvider = await AppDataSource.manager.save(
    Provider.create({
      ...barber,
    }),
  );

  await AppDataSource.manager.save(
    ProviderCityState.create({ city: barber.city, state: barber.state }),
  );

  logger.info("Exiting Registration Service => createProviderInDB");
  return createdProvider;
}
