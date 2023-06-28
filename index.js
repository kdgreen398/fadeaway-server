require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use((req, res, next) => {
  // main middleware function

  console.log("-------LOG-------");
  console.log({
    timestamp: new Date().toISOString(),
    path: req.path,
    queryParams: req.query,
  });
  next();
});

// app.use(require("./routes/images"));

app.listen(port, () => {
  console.log("Server running on port ".concat(port), new Date());
});
