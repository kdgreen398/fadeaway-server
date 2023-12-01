const express = require("express");
const router = express.Router();
const logger = require("../util/logger");
const ServiceManagementService = require("../services/service-management-service");

router.post("/service-management/create-service", async (req, res) => {
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

router.put("/service-management/update-service", async (req, res) => {
  logger.info("Entering Service Management Controller => update-service");

  const { name, length, description, price, serviceId } = req.body;
  const user = req.headers["user"];

  if (!name || !length || !description || !price || !serviceId) {
    res
      .status(400)
      .send(
        "Missing required parameters: name, length, description, price, serviceId",
      );
    return;
  }

  try {
    const response = await ServiceManagementService.updateService(
      name,
      length,
      description,
      price,
      serviceId,
      user.id,
    );

    res.send(response);
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error updating service");
  }
  logger.info("Exiting Service Management Controller => update-service");
});

router.delete("/service-management/delete-service", async (req, res) => {
  logger.info("Entering Service Management Controller => delete-service");

  const { serviceId } = req.query;
  const user = req.headers["user"];

  if (!serviceId) {
    res.status(400).send("Missing required parameters: serviceId");
    return;
  }

  try {
    const response = await ServiceManagementService.deleteService(
      serviceId,
      user.id,
    );

    res.send(response);
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error deleting service");
  }
  logger.info("Exiting Service Management Controller => delete-service");
});

module.exports = router;
