import express, { Request, Response } from "express";

import logger from "../util/logger";
import RegistrationService from "../services/registration-service";
const router = express.Router();

router.post(
  "/registration/register-client",
  async (req: Request, res: Response) => {
    logger.info("Entering Registration Controller => register-client");

    const { firstName, lastName, email, password } = req.body;

    try {
      const response = await RegistrationService.createClientInDB(
        firstName,
        lastName,
        email,
        password,
      );

      if (response.error) {
        res.status(400).send(response.error);
      }

      res.send(response.data);

      logger.info("Exiting Registration Controller => register-client");
    } catch (err: any) {
      logger.error(err);
      res.status(500).send("Error creating client");
    }
  },
);

router.post(
  "/registration/register-barber",
  async (req: Request, res: Response) => {
    logger.info("Entering Registration Controller => register-barber");

    try {
      const response = await RegistrationService.createBarberInDB(req.body);

      if (response.error) {
        res.status(400).send(response.error);
      }

      res.send(response.data);

      logger.info("Exiting Registration Controller => register-barber");
    } catch (err: any) {
      logger.error(err);
      res.status(500).send("Error creating barber");
    }
  },
);

export default router;
