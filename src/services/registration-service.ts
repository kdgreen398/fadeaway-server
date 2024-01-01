import logger from "../util/logger";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Client } from "../entities/client";
import { AppDataSource } from "../util/data-source";
import { Barber } from "../entities/barber";

const { isValidEmail, isStrongPassword } = require("../util/string-validation");
const saltRounds = 10; // You can adjust the number of salt rounds for security.

async function createClientInDB(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) {
  logger.info("Entering Registration Service => createClientInDB");

  if (!firstName || !lastName || !email || !password) {
    return {
      error: "First name, last name, email, and password are required",
    };
  }

  if (!isValidEmail(email)) {
    return {
      error: "Invalid email address",
    };
  }

  if (!isStrongPassword(password)) {
    return {
      error:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    };
  }

  // check if email exists in barber table
  // if so, return error

  const barber = await AppDataSource.manager.findOne(Barber, {
    where: { email },
  });

  if (barber) {
    return {
      error: "Email already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const client = Client.create(firstName, lastName, email, hashedPassword);

  await AppDataSource.manager.save(client);

  logger.info("Exiting Registration Service => createClientInDB");
  return {
    message: "Client created successfully",
  };
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
    return {
      error:
        "First name, last name, email, password, shop, address line 1, city, state, and zip code are required",
    };
  }

  if (!isValidEmail(barberObj.email)) {
    return {
      error: "Invalid email address",
    };
  }

  if (!isStrongPassword(barberObj.password)) {
    return {
      error:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    };
  }

  // check if email exists in client table
  // if so, return error
  const client = await AppDataSource.manager.findOne(Client, {
    where: { email: barberObj.email },
  });

  if (client) {
    return {
      error: "Email already exists",
    };
  }

  // verify address with google maps api

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

  await AppDataSource.manager.save(barber);

  logger.info("Exiting Registration Service => createBarberInDB");
  return {
    message: "Barber created successfully",
  };
}

export default {
  createClientInDB,
  createBarberInDB,
};
