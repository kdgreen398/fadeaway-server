const express = require("express");
const router = express.Router();
const GeolocationService = require("../services/geolocation-service");
const LocationService = require("../services/location-service");
const logger = require("../util/logger");

router.get("/location/getLocationFromCoords", async (req, res) => {
  const lat = req.get("lat");
  const lng = req.get("lng");

  logger.info("Entering Location Controller => getLocationFromCoords");

  if (lat === undefined || lng === undefined) {
    logger.error("Missing lat/lng");
    res.status(400).send("Missing lat/lng");
    return;
  }

  try {
    const address = await GeolocationService.getAddressFromCoords(lat, lng);
    const city = address.split(",")[1].trim();
    const state = address.split(",")[2].split(" ")[1];

    res.send({
      city,
      state,
    });

    logger.info(
      "Exiting Location Controller Successfully => getLocationFromCoords"
    );
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error getting location from coordinates");
  }
});

router.get("/location/getBarberCityStates", async (req, res) => {
  logger.info("Entering Location Controller => getBarberCityStates");
  try {
    const barberCityStates = await LocationService.getBarberCityStates();

    res.send(barberCityStates);

    logger.info(
      "Exiting Location Controller Successfully => getBarberCityStates"
    );
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error getting barber city states");
  }
});

module.exports = router;
