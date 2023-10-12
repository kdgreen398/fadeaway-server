const express = require("express");
const router = express.Router();

router.post("/recommendation/getBarbersByLocation", async (req, res) => {
  res.send("test");
});

module.exports = router;
