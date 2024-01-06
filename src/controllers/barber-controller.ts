import express, { Request, Response } from "express";
import * as BarberService from "../services/barber-service";
import { verifyToken } from "../util/jwt";
import logger from "../util/logger";
import { ResponseObject } from "../util/response-object";

const router = express.Router();

router.get(
  "/barber/fetch-barber-details",
  async (req: Request, res: Response) => {
    logger.info("Entering Barber Controller => fetch-barber-details");

    const { id } = req.query;

    if (!id) {
      res
        .status(400)
        .json(
          ResponseObject.error("Missing required query parameter: publicId"),
        );
      return;
    }

    try {
      const barberDetails = await BarberService.getBarberProfileData(
        Number(id),
      );

      if (!barberDetails) {
        res.status(404).json(ResponseObject.error("Barber not found"));
        return;
      }

      res.json(ResponseObject.success(barberDetails));
    } catch (err: any) {
      logger.error(err);
      res.status(500).json(ResponseObject.error(err.message));
    }
    logger.info("Exiting Barber Controller => fetch-barber-details");
  },
);

router.put(
  "/barber/update-barber-details",
  async (req: Request, res: Response) => {
    logger.info("Entering Barber Controller => update-barber-details");

    const user = verifyToken(req.cookies["auth-token"]);

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
      res
        .status(400)
        .json(ResponseObject.error("Missing required body parameters"));
      return;
    }

    if (user?.accountType !== "barber") {
      res.status(403).json(ResponseObject.error("Unauthorized"));
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

      res.json(ResponseObject.success(barberDetails));
    } catch (err: any) {
      logger.error(err);
      res.status(500).json(ResponseObject.error(err.message));
    }
    logger.info("Exiting Barber Controller => update-barber-details");
  },
);

export default router;
