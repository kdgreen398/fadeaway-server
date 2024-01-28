import express, { Request, Response } from "express";
import { RoleEnum } from "../../enums/role-enum";
import * as AppointmentService from "../../services/appointment-service";
import { DecodedToken } from "../../util/jwt";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";

const router = express.Router();

router.get("/view-all", async (req: Request, res: Response) => {
  logger.info("client-controller => appointment-router/view-all");

  try {
    const user = (req as any).user as DecodedToken;
    const appointments = await AppointmentService.getAppointments(
      user.id,
      RoleEnum.client,
    );
    return res.json(ResponseObject.success(appointments));
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json(ResponseObject.error(error.message));
  }
});

router.post("/create", async (req: Request, res: Response) => {
  logger.info("client-controller => appointment-router/create");

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

  const user = (req as any).user as DecodedToken;

  try {
    const appointment = await AppointmentService.createAppointment(
      user.email,
      providerEmail,
      new Date(startTime),
      services,
    );
    return res.json(ResponseObject.success(appointment));
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json(ResponseObject.error(error.message));
  }
});

router.put("/cancel", async (req: Request, res: Response) => {
  logger.info("client-controller => appointment-router/cancel");

  const { appointmentId } = req.query;

  if (!appointmentId) {
    return res
      .status(400)
      .json(ResponseObject.error("Missing required fields"));
  }

  const user = (req as any).user as DecodedToken;

  try {
    const appointment = await AppointmentService.cancelAppointment(
      user,
      Number(appointmentId),
    );
    return res.json(ResponseObject.success(appointment));
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json(ResponseObject.error(error.message));
  }
});

export default router;
