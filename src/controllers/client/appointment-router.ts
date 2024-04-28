import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { RoleEnum } from "../../enums/role-enum";
import * as AppointmentService from "../../services/appointment-service";
import { AuthorizedRequest } from "../../types/authorized-request";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";

const router = express.Router();

router.get(
  "/view-all",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("client-controller => appointment-router/view-all");

    const { decodedToken } = req as AuthorizedRequest;
    const appointments = await AppointmentService.getAppointments(
      decodedToken.id,
      RoleEnum.CLIENT,
    );
    res.send(ResponseObject.success(appointments));
  }),
);

router.post(
  "/create",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("client-controller => appointment-router/create");

    const { providerEmail, startTime, services } = req.body;

    if (!providerEmail || !startTime || !services) {
      res.status(400).send(ResponseObject.error("Missing required fields"));
      return;
    }

    if (services.length === 0) {
      res
        .status(400)
        .send(ResponseObject.error("At least one service is required"));
      return;
    }

    if (new Date(startTime) < new Date()) {
      res
        .status(400)
        .send(ResponseObject.error("Appointment time cannot be in the past"));
      return;
    }

    const { decodedToken } = req as AuthorizedRequest;

    const appointment = await AppointmentService.createAppointment(
      decodedToken.email,
      providerEmail,
      new Date(startTime),
      services,
    );
    res.send(ResponseObject.success(appointment));
  }),
);

router.put(
  "/cancel",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("client-controller => appointment-router/cancel");

    const { appointmentId } = req.query;

    if (!appointmentId) {
      res.status(400).send(ResponseObject.error("Missing required fields"));
      return;
    }

    const { decodedToken } = req as AuthorizedRequest;

    const appointment = await AppointmentService.cancelAppointment(
      decodedToken,
      Number(appointmentId),
    );
    res.send(ResponseObject.success(appointment));
  }),
);

export default router;
