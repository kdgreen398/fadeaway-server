import * as dotenv from "dotenv";
import "reflect-metadata";
dotenv.config(); // Loads environment variables from .env file into process.env

import express from "express";

import ClientController from "./controllers/client";
import CommonController from "./controllers/common";
import ProviderController from "./controllers/provider";

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
app.use("/api/v1/provider", ProviderController);
app.use("/api/v1/client", ClientController);

app.listen(port, () => {
  console.log("Server running on port ".concat(port), new Date());
});
