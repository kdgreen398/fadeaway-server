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

module.exports = router;
