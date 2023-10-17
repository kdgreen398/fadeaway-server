const express = require("express");
const router = express.Router();
const BarberService = require("../services/barber-service");
const GeolocationService = require("../services/geolocation-service");

router.post("/recommendation/getBarbersByLocation", async (req, res) => {
  const { lat, lng } = req.body;

  if (lat === undefined || lng === undefined) {
    res.status(400).send("Missing lat/lng");
    return;
  }

  try {
    const address = await GeolocationService.getAddressFromCoords(lat, lng);
    const city = address.split(",")[1].trim();
    const state = address.split(",")[2].split(" ")[1];

    const barbers = await BarberService.getBarbersByCityState(city, state);

    res.send({
      city,
      state,
      barbers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving barbers from database");
  }
});

module.exports = router;
