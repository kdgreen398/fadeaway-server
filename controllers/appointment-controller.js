const express = require("express");
const router = express.Router();
const AppointmentService = require("../services/appointment-service");
const logger = require("../util/logger");
const { verifyToken } = require("../util/jwt");

router.get("/appointments/get-apppointments", async (req, res) => {
  logger.info("Entering Appointment Controller => get-apppointments");

  try {
    const token = req.cookies["auth-token-server"];
    const payload = verifyToken(token);
    const appointments = await AppointmentService.getClientAppointments(
      payload,
    );
    res.send(appointments);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }

  logger.info("Exiting Appointment Controller => get-apppointments");
});

module.exports = router;
