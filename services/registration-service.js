const { executeInsertQuery } = require("../util/db/connection-util");
const { CREATE_CLIENT_IN_DB } = require("../util/db/queries");
const logger = require("../util/logger");

const bcrypt = require("bcrypt");
const { isValidEmail, isStrongPassword } = require("../util/string-validation");
const saltRounds = 10; // You can adjust the number of salt rounds for security.

module.exports = {
  createClientInDB: async (firstName, lastName, email, password) => {
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
  },
};
