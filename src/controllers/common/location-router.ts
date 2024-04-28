import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import * as GeolocationService from "../../services/geolocation-service";
import * as LocationService from "../../services/location-service";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";

const router = express.Router();

router.get(
  "/get-location-from-coords",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const lat = req.get("lat");
    const lng = req.get("lng");

    logger.info("Entering Location Controller => get-location-from-coords");

    if (lat === undefined || lng === undefined) {
      logger.error("Missing lat/lng");
      res.status(400).send(ResponseObject.error("Missing lat/lng"));
      return;
    }

    const address = await GeolocationService.getAddressFromCoords(
      parseFloat(lat),
      parseFloat(lng),
    );
    const city = address.split(",")[1].trim();
    const state = address.split(",")[2].split(" ")[1];

    logger.info("Exiting Location Controller => get-location-from-coords");
    res.send(ResponseObject.success({ city, state }));
  }),
);

router.get(
  "/get-provider-city-states",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("Entering Location Controller => get-provider-city-states");
    const providerCityStates = await LocationService.getProviderCityStates();
    res.send(ResponseObject.success(providerCityStates));
    logger.info("Exiting Location Controller => get-provider-city-states");
  }),
);

export default router;
