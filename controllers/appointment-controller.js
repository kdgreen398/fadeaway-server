const express = require("express");
const router = express.Router();
const AppointmentService = require("../services/appointment-service");
const logger = require("../util/logger");
const { verifyToken } = require("../util/jwt");

router.get("/appointments/get-apppointments", async (req, res) => {
  logger.info("Entering Appointment Controller => get-apppointments");

  try {
    const token = req.cookies["auth-token"];
    const user = verifyToken(token);
    const appointments = await AppointmentService.getAppointments(
      user.email,
      user.accountType,
    );
    res.send(appointments);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }

  logger.info("Exiting Appointment Controller => get-apppointments");
});

router.post("/appointments/create-appointment", async (req, res) => {
  logger.info("Entering Appointment Controller => create-appointment");

  const { barberEmail, startTime, services } = req.body;

  if (!barberEmail || !startTime || !services) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const token = req.cookies["auth-token"];
    const user = verifyToken(token);
    if (user.accountType !== "client") {
      throw new Error("Only clients can create appointments");
    }
    const appointment = await AppointmentService.createAppointment(
      user.email,
      barberEmail,
      startTime,
      services,
    );
    res.send(appointment);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }

  logger.info("Exiting Appointment Controller => create-appointment");
});

router.post("/appointments/cancel-appointment", async (req, res) => {
  logger.info("Entering Appointment Controller => cancel-appointment");

  const { apptId } = req.query;

  if (!apptId) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const token = req.cookies["auth-token"];
    const user = verifyToken(token);
    const appointment = await AppointmentService.cancelAppointment(
      user,
      apptId,
    );
    res.send(appointment);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }

  logger.info("Exiting Appointment Controller => cancel-appointment");
});

module.exports = router;
