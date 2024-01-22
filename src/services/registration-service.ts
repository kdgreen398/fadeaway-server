import bcrypt from "bcrypt";
import { Client } from "../entities/client";
import { Provider } from "../entities/provider";
import { ProviderCityState } from "../entities/provider-city-state";
import { AppDataSource } from "../util/data-source";
import logger from "../util/logger";

const saltRounds = 10;

async function checkEmailExists(email: string) {
  const client = await AppDataSource.manager.findOne(Client, {
    where: { email },
  });
  const provider = await AppDataSource.manager.findOne(Provider, {
    where: { email },
  });

  return Boolean(client || provider);
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

export async function createProviderInDB(provider: Provider) {
  logger.info("Entering Registration Service => createProviderInDB");

  const emailExists = await checkEmailExists(provider.email);
  if (emailExists) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(provider.password, saltRounds);

  provider.password = hashedPassword;
  const createdProvider = await AppDataSource.manager.save(
    Provider.create({
      ...provider,
    }),
  );

  await AppDataSource.manager.save(
    ProviderCityState.create({ city: provider.city, state: provider.state }),
  );

  logger.info("Exiting Registration Service => createProviderInDB");
  return createdProvider;
}
