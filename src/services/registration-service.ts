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

export async function createClientInDB(client: Client) {
  logger.info("registration-service => createClientInDB");

  const { firstName, lastName, email, password } = client;

  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    throw new Error("Email already exists");
  }

  await AppDataSource.manager.save(
    Client.create({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, saltRounds),
    }),
  );
}

export async function createProviderInDB(provider: Provider) {
  logger.info("registration-service => createProviderInDB");

  const emailExists = await checkEmailExists(provider.email);
  if (emailExists) {
    throw new Error("Email already exists");
  }

  await AppDataSource.manager.save(
    Provider.create({
      ...provider,
      password: await bcrypt.hash(provider.password, saltRounds),
    }),
  );

  await AppDataSource.manager.save(
    ProviderCityState.create({ city: provider.city, state: provider.state }),
  );
}
