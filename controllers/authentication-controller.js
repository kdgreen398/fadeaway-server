const express = require("express");
const router = express.Router();
const logger = require("../util/logger");
const AuthenticationService = require("../services/authentication-service");

router.post("/authentication/login", async (req, res) => {
  logger.info("Entering Authentication Controller => login");

  const { email, password } = req.body;

  try {
    const authResponse = await AuthenticationService.authenticateUser(
      email,
      password
    );

    if (authResponse.error) {
      res.status(401).send(authResponse.error);
    } else {
      res.send(authResponse);
    }

    logger.info("Exiting Authentication Controller Successfully => login");
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error authenticating user");
  }
});

module.exports = router;
