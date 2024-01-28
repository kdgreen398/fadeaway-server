import * as dotenv from "dotenv";
import "reflect-metadata";
dotenv.config(); // Loads environment variables from .env file into process.env

import express from "express";

import { NextFunction } from "connect";
import { Request, Response, Express } from "express";
import { verifyToken } from "./util/jwt";

import AppointmentController from "./controllers/appointment-controller";
import BusinessHoursController from "./controllers/business-hours-controller";
import ClientController from "./controllers/client-controller";
import ProviderImageController from "./controllers/image-controller";
import LocationController from "./controllers/location-controller";
import ProviderController from "./controllers/provider-controller";
import RecommendationController from "./controllers/recommendation-controller";
import ReviewController from "./controllers/review-controller";
import ServiceManagementController from "./controllers/service-management-controller";
import CommonController from "./controllers/common";

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

app.use("/api/v1/common", CommonController);

// app.use((req: Request, res: Response, next: NextFunction) => {
//   // get auth token from cookies
//   const token = req.cookies["auth-token"];

//   if (!token) {
//     // remove client-side auth cookie
//     res.clearCookie("auth-token");
//     res.status(401).json({ error: "Unauthorized" });
//     return;
//   }

//   try {
//     verifyToken(token);
//   } catch {
//     res.status(401).json({ error: "Unauthorized" });
//     return;
//   }

//   next();
// });

app.listen(port, () => {
  console.log("Server running on port ".concat(port), new Date());
});
