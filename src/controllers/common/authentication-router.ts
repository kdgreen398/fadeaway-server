import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import * as AuthenticationService from "../../services/authentication-service";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";

const router = express.Router();

// const authExpiration = 900000; // 15 minutes
const authExpiration = 3600000 * 24; // 24 hours

router.get(
  "/account",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("common-controller => authentication-router/account");

    const token = req.headers.authorization?.split(" ")[1];

    res.send(ResponseObject.success("Account details"));
  }),
);

router.post(
  "/request",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("common-controller => authentication-router/request");

    res.clearCookie("auth-token");

    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .send(ResponseObject.error("Email and password are required"));
      return;
    }

    const authToken = await AuthenticationService.authenticateUser(
      email,
      password,
    );

    if (!authToken) {
      res.status(401).send(ResponseObject.error("Invalid email or password"));
      return;
    }

    // set cookie for server-side authentication on client
    res.cookie("auth-token", authToken, {
      httpOnly: false, // Set HttpOnly flag for security
      secure: false, // set to true for production
      sameSite: "strict", // Recommended for CSRF prevention
      maxAge: authExpiration, // 1 hour
    });

    res.send(ResponseObject.success("Authenticated successfully"));
  }),
);

router.post(
  "/revoke",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("common-controller => authentication-router/revoke");

    res.clearCookie("auth-token");

    res.send(ResponseObject.success("Authentication revoked"));
  }),
);

export default router;
