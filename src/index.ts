import * as dotenv from "dotenv";
import "reflect-metadata";
dotenv.config(); // Loads environment variables from .env file into process.env

import { NextFunction } from "connect";
import { Request, Response } from "express";
import { verifyToken } from "./util/jwt";

import AppointmentController from "./controllers/appointment-controller";
import AuthenticationController from "./controllers/authentication-controller";
import ProviderController from "./controllers/barber-controller";
import ProviderImageController from "./controllers/barber-image-controller";
import BusinessHoursController from "./controllers/business-hours-controller";
import ClientController from "./controllers/client-controller";
import LocationController from "./controllers/location-controller";
import RecommendationController from "./controllers/recommendation-controller";
import RegistrationController from "./controllers/registration-controller";
import ServiceManagementController from "./controllers/service-management-controller";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("./util/logger");
const port = "3008";

declare global {
  namespace Express {
    interface Request {
      fileValidationError?: string;
    }
  }
}

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use(AuthenticationController);
app.use(RegistrationController);

app.use((req: Request, res: Response, next: NextFunction) => {
  // get auth token from cookies
  const token = req.cookies["auth-token"];

  if (!token) {
    // remove client-side auth cookie
    res.clearCookie("auth-token");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    verifyToken(token);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
});

app.use(ProviderImageController);
app.use(BusinessHoursController);
app.use(LocationController);
app.use(RecommendationController);
app.use(ClientController);
app.use(ProviderController);
app.use(AppointmentController);
app.use(ServiceManagementController);

app.listen(port, () => {
  console.log("Server running on port ".concat(port), new Date());
});
