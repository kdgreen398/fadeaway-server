import { Request, Response } from "express";

import express from "express";
import * as GeolocationService from "../services/geolocation-service";
import * as LocationService from "../services/location-service";
import logger from "../util/logger";
import { ResponseObject } from "../util/response-object";

const router = express.Router();

router.get(
  "/location/get-location-from-coords",
  async (req: Request, res: Response) => {
    const lat = req.get("lat");
    const lng = req.get("lng");

    logger.info("Entering Location Controller => get-location-from-coords");

    if (lat === undefined || lng === undefined) {
      logger.error("Missing lat/lng");
      return res.status(400).json(ResponseObject.error("Missing lat/lng"));
    }

    try {
      const address = await GeolocationService.getAddressFromCoords(
        parseFloat(lat),
        parseFloat(lng),
      );
      const city = address.split(",")[1].trim();
      const state = address.split(",")[2].split(" ")[1];

      logger.info("Exiting Location Controller => get-location-from-coords");
      return res.json(ResponseObject.success({ city, state }));
    } catch (err: any) {
      logger.error(err);
      return res
        .status(500)
        .json(ResponseObject.error("Error getting location from coordinates"));
    }
  },
);

router.get(
  "/location/get-barber-city-states",
  async (req: Request, res: Response) => {
    logger.info("Entering Location Controller => get-barber-city-states");
    try {
      const barberCityStates = await LocationService.getProviderCityStates();
      res.json(ResponseObject.success(barberCityStates));
      logger.info("Exiting Location Controller => get-barber-city-states");
    } catch (err: any) {
      logger.error(err);
      return res
        .status(500)
        .json(ResponseObject.error("Error getting barber city states"));
    }
  },
);

export default router;
