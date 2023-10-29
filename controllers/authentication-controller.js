const express = require("express");
const router = express.Router();
const logger = require("../util/logger");

router.get("/authentication/login", async (req, res) => {
  logger.info("Entering Authentication Controller => login");
  try {
    res.send();

    logger.info("Exiting Authentication Controller Successfully => login");
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error authenticating user");
  }
});

module.exports = router;
