const { executeSelectQuery } = require("../util/db/connection-util");
const {
  FETCH_CLIENT_BY_EMAIL,
  FETCH_BARBER_BY_EMAIL,
} = require("../util/db/queries");
const logger = require("../util/logger");
const { generateToken } = require("../util/jwt");

const bcrypt = require("bcrypt");

async function authenticateUser(email, password) {
  logger.info("Entering Authentication Service => authenticateUser");

  if (!email || !password) {
    return {
      error: "Email and password are required",
    };
  }

  let isAuthenticated = false;
  let error;
  let token;
  let accountType = "client";

  let [user] = await executeSelectQuery(FETCH_CLIENT_BY_EMAIL, [email]);

  // if no user from first table, check second table
  if (!user) {
    [user] = await executeSelectQuery(FETCH_BARBER_BY_EMAIL, [email]);
    accountType = "barber";
  }

  if (user) {
    isAuthenticated = await bcrypt.compare(password, user.password);
  }

  if (isAuthenticated) {
    token = generateToken({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    error = "Invalid email or password";
  }

  logger.info("Exiting Authentication Service => authenticateUser");
  return {
    jwt: token,
    user: user && {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      publicId: user.publicId,
      accountType,
    },
    error,
  };
}

module.exports = {
  authenticateUser,
};
