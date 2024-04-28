import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import * as RegistrationService from "../../services/registration-service";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";
import { isStrongPassword, isValidEmail } from "../../util/string-validation";

const router = express.Router();

const WeakPasswordError =
  "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";

router.post(
  "/client/create",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("common-controller => account-router/client/create");

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res
        .status(400)
        .send(
          ResponseObject.error(
            "First name, last name, email, and password are required",
          ),
        );
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).send(ResponseObject.error("Invalid email address"));
      return;
    }

    if (!isStrongPassword(password)) {
      res.status(400).send(ResponseObject.error(WeakPasswordError));
      return;
    }

    await RegistrationService.createClientInDB(req.body);

    res.send(ResponseObject.success());
  }),
);

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
    res
      .status(400)
      .send(
        ResponseObject.error(
          "First name, last name, email, password, shop, address line 1, city, state, and zip code are required",
        ),
      );
    return;
  }

  if (!isValidEmail(req.body.email)) {
    res.status(400).send(ResponseObject.error("Invalid email address"));
    return;
  }

  if (!isStrongPassword(req.body.password)) {
    res.status(400).send(ResponseObject.error(WeakPasswordError));
    return;
  }

  await RegistrationService.createProviderInDB(req.body);

  res.send(ResponseObject.success());
});

export default router;
