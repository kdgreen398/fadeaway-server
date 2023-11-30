const express = require("express");
const router = express.Router();
const logger = require("../util/logger");
const ServiceManagementService = require("../services/service-management-service");

router.post("/service/create-service", async (req, res) => {
  logger.info("Entering Service Management Controller => create-service");

  const { name, length, description, price } = req.body;
  const user = req.headers["user"];

  if (!name || !length || !description || !price) {
    res
      .status(400)
      .send("Missing required parameters: name, length, description, price");
    return;
  }

  try {
    const response = await ServiceManagementService.createService(
      name,
      length,
      description,
      price,
      user.id,
    );

    res.send(response);
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error fetching barber details");
  }
  logger.info("Exiting Service Management Controller => create-service");
});

module.exports = router;
