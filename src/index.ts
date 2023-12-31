import { NextFunction } from "connect";
import { Response } from "express";
import { verifyToken } from "./util/jwt";
import { CustomRequest } from "./interfaces/custom-request-interface";

// import AppointmentController from "./controllers/appointment-controller";
// import AuthenticationController from "./controllers/authentication-controller";
// import BarberController from "./controllers/barber-controller";
// import LocationController from "./controllers/location-controller";
// import RecommendationController from "./controllers/recommendation-controller";
// import RegistrationController from "./controllers/registration-controller";
// import ServiceManagementController from "./controllers/service-management-controller";

require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("./util/logger");
const port = '3008';

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(AuthenticationController);
// app.use(RegistrationController);

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  // get auth token from cookies
  const token = req.cookies["auth-token"];

  if (!token) {
    // remove client-side auth cookie
    res.clearCookie("auth-token");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    req.decodedToken = verifyToken(token);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
});

// app.use(RecommendationController);
// app.use(LocationController);
// app.use(BarberController);
// app.use(AppointmentController);
// app.use(ServiceManagementController);

app.listen(port, () => {
  console.log("Server running on port ".concat(port), new Date());
});
