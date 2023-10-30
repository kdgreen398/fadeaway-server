const { executeQuery } = require("../util/db/connection-util");
const {
  FETCH_CLIENT_BY_EMAIL,
  FETCH_BARBER_BY_EMAIL,
} = require("../util/db/queries");
const logger = require("../util/logger");
const { generateToken } = require("../util/jwt");

const bcrypt = require("bcrypt");
const saltRounds = 10; // You can adjust the number of salt rounds for security.

// Hash a Password
// bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
//   if (err) {
//     console.error("Error hashing password:", err);
//   } else {
//     // Store 'hashedPassword' in your database for user registration.
//     console.log("Hashed Password:", hashedPassword);
//   }
// });

module.exports = {
  authenticateUser: async (email, password) => {
    logger.info("Entering Authentication Service => authenticateUser");

    let isAuthenticated = false;
    let error;
    let token;
    const defaultError = "Invalid email or password";

    let [user] = await executeQuery(FETCH_CLIENT_BY_EMAIL, [email]);

    // if no user from first table, check second table
    if (!user) {
      [user] = await executeQuery(FETCH_BARBER_BY_EMAIL, [email]);
    }

    if (user) {
      try {
        // Verify a Password
        isAuthenticated = await bcrypt.compare(password, user.password);
      } catch (err) {
        logger.error(err);
        error = defaultError;
      }
    }

    if (isAuthenticated) {
      token = generateToken({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    } else {
      error = defaultError;
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
