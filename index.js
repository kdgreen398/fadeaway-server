require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3008;

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  // main middleware function

  // console.log("-------LOG-------");
  console.log({
    timestamp: new Date().toISOString(),
    path: req.path,
    queryParams: req.query,
  });
  next();
});

app.use(require("./controllers/recommendation-controller"));
app.use(require("./controllers/barber-controller"));
app.use(require("./controllers/appointment-controller"));

app.listen(port, () => {
  console.log("Server running on port ".concat(port), new Date());
});
