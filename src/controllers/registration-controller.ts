import { Request, Response } from "express";
import { CustomRequest } from "../interfaces/custom-request-interface";

const express = require("express");
const router = express.Router();
const logger = require("../util/logger");
const RegistrationService = require("../services/registration-service");

router.post("/registration/register-client", async (req: CustomRequest, res: Response) => {
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

    res.send(response.message);

    logger.info("Exiting Registration Controller => register-client");
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error creating client");
  }
});

router.post("/registration/register-barber", async (req: CustomRequest, res: Response) => {
  logger.info("Entering Registration Controller => register-barber");

  try {
    const response = await RegistrationService.createBarberInDB(req.body);

    if (response.error) {
      res.status(400).send(response.error);
    }

    res.send(response.message);

    logger.info("Exiting Registration Controller => register-barber");
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error creating barber");
  }
});

export default router;
