require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { verifyToken } = require("./util/jwt");
const port = 3008;

app.use(cors());
app.use(bodyParser.json());

app.use(require("./controllers/authentication-controller"));
app.use(require("./controllers/registration-controller"));

app.use((req, res, next) => {
  const token = req.get("auth-token");
  if (!token) {
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
