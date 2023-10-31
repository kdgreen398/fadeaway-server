const { executeQuery } = require("../util/db/connection-util");
const {
  FETCH_CLIENT_BY_EMAIL,
  FETCH_BARBER_BY_EMAIL,
} = require("../util/db/queries");
const logger = require("../util/logger");
const { generateToken } = require("../util/jwt");

const bcrypt = require("bcrypt");

module.exports = {
  authenticateUser: async (email, password) => {
    logger.info("Entering Authentication Service => authenticateUser");

    let isAuthenticated = false;
    let error;
    let token;

    let [user] = await executeQuery(FETCH_CLIENT_BY_EMAIL, [email]);

    // if no user from first table, check second table
    if (!user) {
      [user] = await executeQuery(FETCH_BARBER_BY_EMAIL, [email]);
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

    logger.info(
      "Exiting Authentication Service Successfully => authenticateUser"
    );
    return {
      jwt: token,
      error,
    };
  },
};