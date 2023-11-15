const { executeInsertQuery } = require("../util/db/connection-util");
const {
  CREATE_CLIENT_IN_DB,
  CREATE_BARBER_IN_DB,
} = require("../util/db/queries");
const logger = require("../util/logger");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { isValidEmail, isStrongPassword } = require("../util/string-validation");
const saltRounds = 10; // You can adjust the number of salt rounds for security.

// Will be used to generate public profile id's for barbers
function generateProfileId(email) {
  // Create a hash object using a secure algorithm like SHA-256
  const hash = crypto.createHash("MD5");

  // Update the hash with the email
  hash.update(email);

  // Get the hexadecimal representation of the hash
  const profileId = hash.digest("hex");

  return profileId;
}

async function createClientInDB(firstName, lastName, email, password) {
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
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await executeInsertQuery(CREATE_CLIENT_IN_DB, [
    firstName,
    lastName,
    email,
    hashedPassword,
  ]);

  logger.info("Exiting Registration Service => createClientInDB");
  return {
    message: "Client created successfully",
  };
}

async function createBarberInDB(barber) {
  logger.info("Entering Registration Service => createBarberInDB");

  const {
    firstName,
    lastName,
    email,
    password,
    shop,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
  } = barber;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !shop ||
    !addressLine1 ||
    !city ||
    !state ||
    !zipCode
  ) {
    return {
      error:
        "First name, last name, email, password, shop, address line 1, city, state, and zip code are required",
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
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await executeInsertQuery(CREATE_BARBER_IN_DB, [
    firstName,
    lastName,
    shop,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    email,
    hashedPassword,
    generateProfileId(email),
  ]);

  logger.info("Exiting Registration Service => createBarberInDB");
  return {
    message: "Barber created successfully",
  };
}

module.exports = {
  createClientInDB,
  createBarberInDB,
};
