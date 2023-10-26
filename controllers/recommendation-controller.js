const express = require("express");
const router = express.Router();
const BarberService = require("../services/barber-service");
const GeolocationService = require("../services/geolocation-service");
const logger = require("../util/logger");

router.get("/recommendation/getBarbersByLocation", async (req, res) => {
  const lat = req.get("lat");
  const lng = req.get("lng");
  let city = req.get("city");
  let state = req.get("state");

  logger.info("Entering Recommendation Controller => getBarbersByLocation");

  const hasCoords = lat !== undefined && lng !== undefined;
  const hasCityState = city !== undefined && state !== undefined;

  if (!hasCoords && !hasCityState) {
    logger.error("Missing location parameters (lat/lng or city/state)");
    res.status(400).send("Missing location parameters (lat/lng or city/state)");
    return;
  }

  try {
    if (!hasCityState) {
      const address = await GeolocationService.getAddressFromCoords(lat, lng);
      city = address.split(",")[1].trim();
      state = address.split(",")[2].split(" ")[1];
    }

    const barbers = await BarberService.getBarbersByCityState(city, state);

    res.send(barbers);

    logger.info(
      "Exiting Recommendation Controller Successfully => getBarbersByLocation"
    );
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error retrieving barbers from database");
  }
});

module.exports = router;
