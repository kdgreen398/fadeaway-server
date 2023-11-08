const express = require("express");
const router = express.Router();
const AppointmentService = require("../services/appointment-service");
const logger = require("../util/logger");
const { verifyToken } = require("../util/jwt");

router.get("/appointments/get-apppointments", async (req, res) => {
  logger.info("Entering Appointment Controller => get-apppointments");
  const token = req.cookies["auth-token-server"];
  const payload = verifyToken(token);
  AppointmentService.getClientAppointments(payload);
  logger.info("Exiting Appointment Controller => get-apppointments");
  res.send("get-appointments");
});

module.exports = router;
