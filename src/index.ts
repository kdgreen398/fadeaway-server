import * as dotenv from "dotenv";
import "reflect-metadata";
dotenv.config(); // Loads environment variables from .env file into process.env

import express from "express";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import helmet from "helmet";
import ClientController from "./controllers/client";
import CommonController from "./controllers/common";
import ProviderController from "./controllers/provider";

const app = express();

const port = process.env.PORT || 3000;

const serviceAccount = process.env.FIREBASE_ADMIN_KEY;

if (!serviceAccount) {
  console.error("FIREBASE_ADMIN_KEY not found in environment variables");
  process.exit(1);
}

const firebaseApp = initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

declare module "express-serve-static-core" {
  interface Request {
    fileValidationError?: string;
  }
}

// Security middlewares
app.use(helmet()); // Set various HTTP headers for security

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
);

const allowedOrigins: string[] = [
  "http://localhost:8081",
  "https://react-native-barber-app-demo-dot-barber-booking-app-401120.uc.r.appspot.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/v1/common", CommonController);
app.use("/api/v1/provider", ProviderController);
app.use("/api/v1/client", ClientController);

app.listen(port, () => {
  console.log("Server running on port ".concat(port as string), new Date());
});

// initializeDataSource()
//   .then(() => {
//     app.listen(port, () => {
//       console.log("Server running on port ".concat(port as string), new Date());
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to initialize data source", err);
//   });
