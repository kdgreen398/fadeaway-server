import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import * as GeolocationService from "../services/geolocation-service";
import * as ProviderService from "../services/provider-service";
import logger from "../util/logger";
import { ResponseObject } from "../util/response-object";

const router = express.Router();

router.get(
  "/recommendation/get-providers-by-location",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info(
      "Entering Recommendation Controller => get-providers-by-location",
    );

    const lat = req.get("lat") as string;
    const lng = req.get("lng") as string;
    let city = req.get("city") as string;
    let state = req.get("state") as string;

    const hasCoords = lat !== undefined && lng !== undefined;
    const hasCityState = city !== undefined && state !== undefined;

    if (!hasCoords && !hasCityState) {
      logger.error("Missing location parameters (lat/lng or city/state)");
      res
        .status(400)
        .send(
          ResponseObject.error(
            "Missing location parameters (lat/lng or city/state)",
          ),
        );
      return;
    }

    if (!hasCityState) {
      const address = await GeolocationService.getAddressFromCoords(
        parseFloat(lat),
        parseFloat(lng),
      );
      city = address.split(",")[1].trim();
      state = address.split(",")[2].split(" ")[1];
    }

    const providers = await ProviderService.getProvidersByCityState(
      city,
      state,
    );

    logger.info(
      "Exiting Recommendation Controller => get-providers-by-location",
    );
    res.send(
      ResponseObject.success(
        providers.filter((provider) => provider.images.length > 0),
      ),
    );
  }),
);

export default router;
