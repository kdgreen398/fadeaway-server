const express = require("express");
const router = express.Router();
const logger = require("../util/logger");

router.post("/registration/register-user", async (req, res) => {
  logger.info("Entering Registration Controller => register-user");

  try {
    res.send();

    logger.info(
      "Exiting Registration Controller Successfully => register-user"
    );
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error registratering user");
  }
});

module.exports = router;
