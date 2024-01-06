import { Barber } from "../entities/barber";
import { Client } from "../entities/client";
import { AppDataSource } from "../util/data-source";
import bcrypt from "bcrypt";

import logger from "../util/logger";
import { generateToken } from "../util/jwt";

export async function authenticateUser(email: string, password: string) {
  logger.info("Entering Authentication Service => authenticateUser");

  let isAuthenticated = false;
  let token;
  let accountType = "client";

  let user = await AppDataSource.manager.findOne(Client, {
    where: { email },
  });

  if (!user) {
    user = await AppDataSource.manager.findOne(Barber, {
      where: { email },
    });
    accountType = "barber";
  }

  if (user) {
    isAuthenticated = await bcrypt.compare(password, user.password);
  }

  if (user && isAuthenticated) {
    token = generateToken({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountType,
    });
  }

  logger.info("Exiting Authentication Service => authenticateUser");
  return token;
}
