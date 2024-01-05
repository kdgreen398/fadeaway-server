import express, { Request, Response } from "express";

import logger from "../util/logger";
import * as RegistrationService from "../services/registration-service";
import { ResponseObject } from "../util/response-object";
import { isValidEmail, isStrongPassword } from "../util/string-validation";

const router = express.Router();

const WeakPasswordError =
  "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";

router.post(
  "/registration/register-client",
  async (req: Request, res: Response) => {
    logger.info("Entering Registration Controller => register-client");

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .send(
          ResponseObject.error(
            "First name, last name, email, and password are required",
          ),
        );
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send(ResponseObject.error("Invalid email address"));
    }

    if (!isStrongPassword(password)) {
      return res.status(400).send(ResponseObject.error(WeakPasswordError));
    }

    try {
      const client = await RegistrationService.createClientInDB(
        firstName,
        lastName,
        email,
        password,
      );

      delete (client as Partial<typeof client>).password;

      logger.info("Exiting Registration Controller => register-client");
      res.json(ResponseObject.success(client));
    } catch (err: any) {
      logger.error(err);
      res.status(500).json(ResponseObject.error(err.message));
    }
  },
);

router.post(
  "/registration/register-barber",
  async (req: Request, res: Response) => {
    logger.info("Entering Registration Controller => register-barber");

    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.password ||
      !req.body.shop ||
      !req.body.addressLine1 ||
      !req.body.city ||
      !req.body.state ||
      !req.body.zipCode
    ) {
      return res
        .status(400)
        .send(
          ResponseObject.error(
            "First name, last name, email, password, shop, address line 1, city, state, and zip code are required",
          ),
        );
    }

    if (!isValidEmail(req.body.email)) {
      return res
        .status(400)
        .send(ResponseObject.error("Invalid email address"));
    }

    if (!isStrongPassword(req.body.password)) {
      return res.status(400).send(ResponseObject.error(WeakPasswordError));
    }

    try {
      const barber = await RegistrationService.createBarberInDB(req.body);

      delete (barber as Partial<typeof barber>).password;

      logger.info("Exiting Registration Controller => register-barber");
      res.json(ResponseObject.success(barber));
    } catch (err: any) {
      logger.error(err);
      res.status(500).json(ResponseObject.error(err.message));
    }
  },
);

export default router;
