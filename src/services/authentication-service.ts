import bcrypt from "bcrypt";
import { Client } from "../entities/client";
import { Provider } from "../entities/provider";
import { AppDataSource } from "../util/data-source";

import { RoleEnum } from "../enums/role-enum";
import { generateToken } from "../util/jwt";
import logger from "../util/logger";

export async function authenticateUser(email: string, password: string) {
  logger.info("authenticaton-service => authenticateUser");

  const user =
    (await AppDataSource.manager.findOne(Client, {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
      },
      where: { email },
    })) ||
    (await AppDataSource.manager.findOne(Provider, {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
      },
      where: { email },
    }));

  if (!user) {
    return null;
  }
  const isAuthenticated = await bcrypt.compare(password, user.password);

  if (!isAuthenticated) {
    return null;
  }

  return generateToken({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user instanceof Client ? RoleEnum.CLIENT : RoleEnum.PROVIDER,
  });
}
