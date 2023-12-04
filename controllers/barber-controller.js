const express = require("express");
const router = express.Router();
const logger = require("../util/logger");
const BarberService = require("../services/barber-service");

router.get("/barber/fetch-barber-details", async (req, res) => {
  logger.info("Entering Barber Controller => fetch-barber-details");

  const { publicId } = req.query;

  if (!publicId) {
    res.status(400).send("Missing required query parameter: publicId");
    return;
  }

  try {
    const barberDetails = await BarberService.getBarberDetails(publicId);

    if (!barberDetails) {
      res.status(404).send("Barber not found");
      return;
    }

    res.send(barberDetails);
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error fetching barber details");
  }
  logger.info("Exiting Barber Controller => fetch-barber-details");
});

router.put("/barber/update-barber-details", async (req, res) => {
  logger.info("Entering Barber Controller => update-barber-details");

  const user = req.headers["user"];

  const {
    firstName,
    lastName,
    alias,
    bio,
    shop,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !shop ||
    !addressLine1 ||
    !city ||
    !state ||
    !zipCode
  ) {
    res.status(400).send("Missing required body parameters");
    return;
  }

  if (user.accountType !== "barber") {
    res.status(403).send("Unauthorized");
    return;
  }

  try {
    const barberDetails = await BarberService.updateBarberDetails(
      user.id,
      firstName,
      lastName,
      alias,
      bio,
      shop,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
    );

    res.send(barberDetails);
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error updating barber details");
  }
  logger.info("Entering Barber Controller => update-barber-details");
});

module.exports = router;
