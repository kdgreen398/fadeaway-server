const express = require("express");
const router = express.Router();
const logger = require("../util/logger");
const AuthenticationService = require("../services/authentication-service");

// const authExpiration = 900000; // 15 minutes
const authExpiration = 3600000; // 1 hour

router.post("/authentication/validate-user", async (req, res) => {
  logger.info("Entering Authentication Controller => validate-user");

  const { email, password } = req.body;

  try {
    const authResponse = await AuthenticationService.authenticateUser(
      email,
      password,
    );

    if (authResponse.error) {
      res.status(401).send(authResponse.error);
    } else {
      // set cookie for server-side authentication on client (cannot be accessed by client side code)
      res.cookie("auth-token-server", authResponse.jwt, {
        httpOnly: true, // Set HttpOnly flag for security
        secure: false, // set to true for production
        sameSite: "strict", // Recommended for CSRF prevention
        maxAge: authExpiration, // 1 hour
      });
      // set cookie for client-side authentication on client (can be accessed by client side code)
      res.cookie("auth-token-client", authResponse.user, {
        httpOnly: false, // Set HttpOnly flag for security
        secure: false, // set to true for production
        sameSite: "strict", // Recommended for CSRF prevention
        maxAge: authExpiration, // 1 hour
      });
      res.send("User authenticated successfully");
    }

    logger.info("Exiting Authentication Controller => validate-user");
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error authenticating user");
  }
});

router.post("/authentication/revoke-authentication", async (req, res) => {
  logger.info("Entering Authentication Controller => revoke-authentication");

  res.clearCookie("auth-token-server");
  res.clearCookie("auth-token-client");

  res.send("Authentication revoked");
  logger.info("Exiting Authentication Controller => revoke-authentication");
});

module.exports = router;
