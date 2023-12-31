import { Request, Response, Router } from "express";
import { CustomRequest } from "../interfaces/custom-request-interface";

const express = require("express");

const router = express.Router();
const GeolocationService = require("../services/geolocation-service");
const LocationService = require("../services/location-service");
const logger = require("../util/logger");

router.get("/location/get-location-from-coords", async (req: CustomRequest, res: Response) => {
  const lat = req.get("lat");
  const lng = req.get("lng");

  logger.info("Entering Location Controller => get-location-from-coords");

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

    logger.info("Exiting Location Controller => get-location-from-coords");
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error getting location from coordinates");
  }
});

router.get("/location/get-barber-city-states", async (req: CustomRequest, res: Response) => {
  logger.info("Entering Location Controller => get-barber-city-states");
  try {
    const barberCityStates = await LocationService.getBarberCityStates();

    res.send(barberCityStates);

    logger.info("Exiting Location Controller => get-barber-city-states");
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error getting barber city states");
  }
});

export default router;
