import logger from "../util/logger";
import bcrypt from "bcrypt";
import { Client } from "../entities/client";
import { AppDataSource } from "../util/data-source";
import { Barber } from "../entities/barber";
import { ResponseObject } from "../util/response-object";

const { isValidEmail, isStrongPassword } = require("../util/string-validation");
const saltRounds = 10;

async function validateAndHashPassword(
  password: string,
): Promise<ResponseObject> {
  if (!isStrongPassword(password)) {
    return ResponseObject.error(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    );
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return ResponseObject.success(hashedPassword);
}

async function checkEmailExists(email: string) {
  const client = await AppDataSource.manager.findOne(Client, {
    where: { email },
  });
  const barber = await AppDataSource.manager.findOne(Barber, {
    where: { email },
  });

  return Boolean(client || barber);
}

async function createClientInDB(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) {
  logger.info("Entering Registration Service => createClientInDB");

  if (!firstName || !lastName || !email || !password) {
    return ResponseObject.error(
      "First name, last name, email, and password are required",
    );
  }

  if (!isValidEmail(email)) {
    return ResponseObject.error("Invalid email address");
  }

  const hashedPassword = await validateAndHashPassword(password);
  if (hashedPassword.error) return ResponseObject.error(hashedPassword.error);

  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    return ResponseObject.error("Email already exists");
  }

  const client = Client.create(firstName, lastName, email, hashedPassword.data);

  await AppDataSource.manager.save(client);

  logger.info("Exiting Registration Service => createClientInDB");
  return ResponseObject.success("Client created successfully");
}

async function createBarberInDB(barberObj: Barber) {
  logger.info("Entering Registration Service => createBarberInDB");

  if (
    !barberObj.firstName ||
    !barberObj.lastName ||
    !barberObj.email ||
    !barberObj.password ||
    !barberObj.shop ||
    !barberObj.addressLine1 ||
    !barberObj.city ||
    !barberObj.state ||
    !barberObj.zipCode
  ) {
    return ResponseObject.error(
      "First name, last name, email, password, shop, address line 1, city, state, and zip code are required",
    );
  }

  if (!isValidEmail(barberObj.email)) {
    return ResponseObject.error("Invalid email address");
  }

  const hashedPassword = await validateAndHashPassword(barberObj.password);
  if (hashedPassword.error) return ResponseObject.error(hashedPassword.error);

  const emailExists = await checkEmailExists(barberObj.email);
  if (emailExists) {
    return ResponseObject.error("Email already exists");
  }

  const barber = Barber.create(
    barberObj.firstName,
    barberObj.lastName,
    barberObj.email,
    hashedPassword.data,
    barberObj.shop,
    barberObj.addressLine1,
    barberObj.addressLine2,
    barberObj.city,
    barberObj.state,
    barberObj.zipCode,
  );

  await AppDataSource.manager.save(barber);

  logger.info("Exiting Registration Service => createBarberInDB");
  return ResponseObject.success("Barber created successfully");
}

export default {
  createClientInDB,
  createBarberInDB,
};
