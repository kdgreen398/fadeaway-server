import express, { Request, Response } from "express";

import * as AuthenticationService from "../services/authentication-service";
import logger from "../util/logger";
import { ResponseObject } from "../util/response-object";
const router = express.Router();

// const authExpiration = 900000; // 15 minutes
const authExpiration = 3600000 * 24; // 24 hours

router.post(
  "/authentication/validate-user",
  async (req: Request, res: Response) => {
    logger.info("Entering Authentication Controller => validate-user");

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send(ResponseObject.error("Email and password are required"));
    }

    try {
      const authToken = await AuthenticationService.authenticateUser(
        email,
        password,
      );

      if (!authToken) {
        return res
          .status(401)
          .send(ResponseObject.error("Invalid email or password"));
      }

      // set cookie for server-side authentication on client
      res.cookie("auth-token", authToken, {
        httpOnly: false, // Set HttpOnly flag for security
        secure: false, // set to true for production
        sameSite: "strict", // Recommended for CSRF prevention
        maxAge: authExpiration, // 1 hour
      });
      res.send(ResponseObject.success("User authenticated successfully"));

      logger.info("Exiting Authentication Controller => validate-user");
    } catch (err: any) {
      logger.error(err);
      res.status(500).send(ResponseObject.error(err.message));
    }
  },
);

router.post(
  "/authentication/revoke-authentication",
  async (req: Request, res: Response) => {
    logger.info("Entering Authentication Controller => revoke-authentication");

    res.clearCookie("auth-token");

    res.send(ResponseObject.success("Authentication revoked"));
    logger.info("Exiting Authentication Controller => revoke-authentication");
  },
);

export default router;
