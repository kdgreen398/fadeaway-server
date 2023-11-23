require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { verifyToken } = require("./util/jwt");
const logger = require("./util/logger");
const port = 3008;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use(require("./controllers/authentication-controller"));
app.use(require("./controllers/registration-controller"));

app.use((req, res, next) => {
  // get auth token from cookies
  const token = req.cookies["auth-token-server"];

  if (!token) {
    // remove client-side auth cookie
    res.clearCookie("auth-token-client");
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

app.use(require("./controllers/recommendation-controller"));
app.use(require("./controllers/location-controller"));
app.use(require("./controllers/barber-controller"));
app.use(require("./controllers/appointment-controller"));

app.listen(port, () => {
  console.log("Server running on port ".concat(port), new Date());
});
