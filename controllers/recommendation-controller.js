const express = require("express");
const router = express.Router();
const BarberService = require("../services/barber-service");

router.post("/recommendation/getBarbersByLocation", async (req, res) => {
  const { lat, lng } = req.body;

  if (lat === undefined || lng === undefined) {
    res.status(400).send("Missing lat/lng");
    return;
  }

  try {
    const barbers = await BarberService.getBarbersByLocation(lat, lng);
    res.send(barbers);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving barbers from database");
  }
});

module.exports = router;
