import { Request, Response } from "express";
import express from "express";
import * as AppointmentService from "../services/appointment-service";
import logger from "../util/logger";
import { verifyToken } from "../util/jwt";

const router = express.Router();

router.get(
  "/appointments/get-apppointments",
  async (req: Request, res: Response) => {
    logger.info("Entering Appointment Controller => get-apppointments");

    try {
      const user = verifyToken(req.cookies["auth-token"]);
      const appointments = await AppointmentService.getAppointments(
        user.email,
        user.accountType,
      );
      res.send(appointments);
    } catch (error: any) {
      logger.error(error);
      res.status(500).send(error.message);
    }

    logger.info("Exiting Appointment Controller => get-apppointments");
  },
);

router.post(
  "/appointments/create-appointment",
  async (req: Request, res: Response) => {
    logger.info("Entering Appointment Controller => create-appointment");

    const { barberEmail, startTime, services } = req.body;

    if (!barberEmail || !startTime || !services) {
      return res.status(400).send("Missing required fields");
    }

    try {
      const user = verifyToken(req.cookies["auth-token"]);
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
    } catch (error: any) {
      logger.error(error);
      res.status(500).send(error.message);
    }

    logger.info("Exiting Appointment Controller => create-appointment");
  },
);

router.post(
  "/appointments/cancel-appointment",
  async (req: Request, res: Response) => {
    logger.info("Entering Appointment Controller => cancel-appointment");

    const { apptId } = req.query;

    if (!apptId) {
      return res.status(400).send("Missing required fields");
    }

    try {
      const user = verifyToken(req.cookies["auth-token"]);
      const appointment = await AppointmentService.cancelAppointment(
        user,
        apptId,
      );
      res.send(appointment);
    } catch (error: any) {
      logger.error(error);
      res.status(500).send(error.message);
    }

    logger.info("Exiting Appointment Controller => cancel-appointment");
  },
);

export default router;
