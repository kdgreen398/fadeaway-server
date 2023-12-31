import { Request, Response } from "express";
import { CustomRequest } from "../interfaces/custom-request-interface";

const express = require("express");
const router = express.Router();
const logger = require("../util/logger");
const AuthenticationService = require("../services/authentication-service");

// const authExpiration = 900000; // 15 minutes
const authExpiration = 3600000 * 24; // 24 hours

interface UserCredentials {
  email: string;
  password: string;
}

router.post("/authentication/validate-user", async (req: CustomRequest, res: Response) => {
  logger.info("Entering Authentication Controller => validate-user");

  const { email, password } = req.body as UserCredentials;

  try {
    const authResponse = await AuthenticationService.authenticateUser(
      email,
      password,
    );

    if (authResponse.error) {
      res.status(401).send(authResponse.error);
    } else {
      // set cookie for server-side authentication on client
      res.cookie("auth-token", authResponse.jwt, {
        httpOnly: false, // Set HttpOnly flag for security
        secure: false, // set to true for production
        sameSite: "strict", // Recommended for CSRF prevention
        maxAge: authExpiration, // 1 hour
      });
      res.send("User authenticated successfully");
    }

    logger.info("Exiting Authentication Controller => validate-user");
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error authenticating user");
  }
});

router.post("/authentication/revoke-authentication", async (req: CustomRequest, res: Response) => {
  logger.info("Entering Authentication Controller => revoke-authentication");

  res.clearCookie("auth-token");

  res.send("Authentication revoked");
  logger.info("Exiting Authentication Controller => revoke-authentication");
});

export default router;
