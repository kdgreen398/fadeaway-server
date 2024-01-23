import express, { Request, Response } from "express";
import { AppointmentStatusEnum } from "../enums/appointment-status-enum";
import { RoleEnum } from "../enums/role-enum";
import * as AppointmentService from "../services/appointment-service";
import { verifyToken } from "../util/jwt";
import logger from "../util/logger";
import { ResponseObject } from "../util/response-object";

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
      res.json(ResponseObject.success(appointments));
    } catch (error: any) {
      logger.error(error);
      res.status(500).json(ResponseObject.error(error.message));
    }

    logger.info("Exiting Appointment Controller => get-apppointments");
  },
);

router.post(
  "/appointments/create-appointment",
  async (req: Request, res: Response) => {
    logger.info("Entering Appointment Controller => create-appointment");

    const { providerEmail, startTime, services } = req.body;

    if (!providerEmail || !startTime || !services) {
      return res
        .status(400)
        .json(ResponseObject.error("Missing required fields"));
    }

    if (services.length === 0) {
      return res
        .status(400)
        .json(ResponseObject.error("At least one service is required"));
    }

    if (new Date(startTime) < new Date()) {
      return res
        .status(400)
        .json(ResponseObject.error("Appointment time cannot be in the past"));
    }

    const user = verifyToken(req.cookies["auth-token"]);
    if (user.accountType !== RoleEnum.client) {
      return res
        .status(401)
        .json(ResponseObject.error("Only clients can create appointments"));
    }

    try {
      const appointment = await AppointmentService.createAppointment(
        user.email,
        providerEmail,
        new Date(startTime),
        services,
      );
      res.json(ResponseObject.success(appointment));
    } catch (error: any) {
      logger.error(error);
      res.status(500).json(ResponseObject.error(error.message));
    }

    logger.info("Exiting Appointment Controller => create-appointment");
  },
);

router.put(
  "/appointments/cancel-appointment",
  async (req: Request, res: Response) => {
    logger.info("Entering Appointment Controller => cancel-appointment");

    const { apptId } = req.query;

    if (!apptId) {
      return res
        .status(400)
        .json(ResponseObject.error("Missing required fields"));
    }

    try {
      const user = verifyToken(req.cookies["auth-token"]);
      const appointment = await AppointmentService.cancelAppointment(
        user,
        Number(apptId),
      );
      res.json(ResponseObject.success(appointment));
    } catch (error: any) {
      logger.error(error);
      res.status(500).json(ResponseObject.error(error.message));
    }

    logger.info("Exiting Appointment Controller => cancel-appointment");
  },
);

router.put(
  "/appointments/provider/update-appointment-status",
  async (req: Request, res: Response) => {
    logger.info("Entering Appointment Controller => update-appointment-status");

    if (!req.query.apptId || !req.query.status) {
      return res
        .status(400)
        .json(ResponseObject.error("Missing required fields"));
    }

    const user = verifyToken(req.cookies["auth-token"]);

    if (user.accountType !== RoleEnum.provider) {
      return res.status(401).json(ResponseObject.error("Unauthorized"));
    }

    const { apptId } = req.query;
    const status = String(req.query.status).toLowerCase();

    // check if status is part of enum
    if (
      !Object.values(AppointmentStatusEnum).includes(
        status as AppointmentStatusEnum,
      )
    ) {
      return res
        .status(400)
        .json(ResponseObject.error("Invalid status value provided"));
    }

    try {
      const appointment = await AppointmentService.updateAppointmentStatus(
        Number(apptId),
        status as AppointmentStatusEnum,
        user,
      );
      res.json(ResponseObject.success(appointment));
    } catch (error: any) {
      logger.error(error);
      res.status(500).json(ResponseObject.error(error.message));
    }

    logger.info("Exiting Appointment Controller => update-appointment-status");
  },
);

export default router;
