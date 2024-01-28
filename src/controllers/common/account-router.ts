import express, { Request, Response } from "express";

import * as RegistrationService from "../../services/registration-service";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";
import { isStrongPassword, isValidEmail } from "../../util/string-validation";

const router = express.Router();

const WeakPasswordError =
  "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";

router.post("/client/create", async (req: Request, res: Response) => {
  logger.info("common-controller => account-router/client/create");

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
    return res.status(400).send(ResponseObject.error("Invalid email address"));
  }

  if (!isStrongPassword(password)) {
    return res.status(400).send(ResponseObject.error(WeakPasswordError));
  }

  try {
    await RegistrationService.createClientInDB(req.body);

    return res.json(ResponseObject.success());
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json(ResponseObject.error(err.message));
  }
});

router.post("/provider/create", async (req: Request, res: Response) => {
  logger.info("common-controller => account-router/provider/create");

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
    return res.status(400).send(ResponseObject.error("Invalid email address"));
  }

  if (!isStrongPassword(req.body.password)) {
    return res.status(400).send(ResponseObject.error(WeakPasswordError));
  }

  try {
    await RegistrationService.createProviderInDB(req.body);

    return res.json(ResponseObject.success());
  } catch (err: any) {
    logger.error(err);
    res.status(500).json(ResponseObject.error(err.message));
  }
});

export default router;