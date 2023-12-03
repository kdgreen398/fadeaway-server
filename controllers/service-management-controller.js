const express = require("express");
const router = express.Router();
const logger = require("../util/logger");
const ServiceManagementService = require("../services/service-management-service");

function validateParameters(hours, minutes, price) {
  if (
    !Number.isInteger(minutes) ||
    !Number.isInteger(hours) ||
    !Number.isInteger(price)
  ) {
    throw new Error(
      "Invalid values: minutes, hours, and price must be whole numbers",
    );
  }

  if (hours < 0 || minutes < 0 || price < 0) {
    throw new Error(
      "Invalid values: minutes, hours, and price must be greater than 0",
    );
  }

  if (hours === 0 && minutes === 0) {
    throw new Error("Invalid time: hours and minutes cannot both be 0");
  }

  if (price === 0) {
    throw new Error("Invalid price: price cannot be 0");
  }

  if (price > 999) {
    throw new Error("Invalid price: price cannot be greater than 999");
  }

  if (hours >= 24 || minutes >= 60) {
    throw new Error(
      "Invalid time: minutes must be less than 60 and hours less than 24",
    );
  }

  if (minutes % 15 !== 0) {
    throw new Error("Invalid time: minutes must be a multiple of 15");
  }
}

router.get("/service-management/get-services", async (req, res) => {
  logger.info("Entering Service Management Controller => get-services");

  const { barberId } = req.query;

  if (!barberId) {
    res.status(400).send("Missing required parameters: barberId");
    return;
  }

  try {
    const response = await ServiceManagementService.getServices(barberId);

    res.send(response);
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error getting services");
  }
  logger.info("Exiting Service Management Controller => get-services");
});

router.post("/service-management/create-service", async (req, res) => {
  logger.info("Entering Service Management Controller => create-service");

  const { name, hours, minutes, description, price } = req.body;
  const user = req.headers["user"];

  try {
    if (
      !name ||
      (!hours && hours !== 0) ||
      (!minutes && minutes !== 0) ||
      (!price && price !== 0)
    ) {
      throw new Error(
        "Missing required parameters: name, hours, minutes, price",
      );
    }
    validateParameters(hours, minutes, price);
  } catch (err) {
    logger.error(err);
    res.status(400).send(err.message);
    return;
  }

  try {
    const response = await ServiceManagementService.createService(
      name,
      hours,
      minutes,
      description,
      price,
      user.id,
    );

    res.status(201).send(response);
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error creating service");
  }
  logger.info("Exiting Service Management Controller => create-service");
});

router.put("/service-management/update-service", async (req, res) => {
  logger.info("Entering Service Management Controller => update-service");

  const { name, hours, minutes, description, price, serviceId } = req.body;
  const user = req.headers["user"];

  try {
    if (
      !name ||
      (!hours && hours !== 0) ||
      (!minutes && minutes !== 0) ||
      (!price && price !== 0) ||
      !serviceId
    ) {
      throw new Error(
        "Missing required parameters: name, hours, minutes, price, serviceId",
      );
    }
    validateParameters(hours, minutes, price);
  } catch (err) {
    logger.error(err);
    res.status(400).send(err.message);
    return;
  }

  try {
    const response = await ServiceManagementService.updateService(
      name,
      hours,
      minutes,
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
