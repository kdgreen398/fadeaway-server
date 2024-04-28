import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { AppointmentStatusEnum } from "../../enums/appointment-status-enum";
import { RoleEnum } from "../../enums/role-enum";
import * as AppointmentService from "../../services/appointment-service";
import { AuthorizedRequest } from "../../types/authorized-request";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";

const router = express.Router();

router.get(
  "/view-all",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("provider-controller => appointment-router/view-all");

    const { decodedToken } = req as AuthorizedRequest;
    const appointments = await AppointmentService.getAppointments(
      decodedToken.id,
      RoleEnum.PROVIDER,
    );
    res.send(ResponseObject.success(appointments));
  }),
);

router.put(
  "/update-status",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("provider-controller => appointment-router/update-status");

    if (!req.query.appointmentId || !req.query.status) {
      res.status(400).send(ResponseObject.error("Missing required fields"));
    }

    const { decodedToken } = req as AuthorizedRequest;
    const { appointmentId } = req.query;
    const status = String(req.query.status).toLowerCase();

    // check if status is part of enum
    if (
      !Object.values(AppointmentStatusEnum).includes(
        status as AppointmentStatusEnum,
      )
    ) {
      res
        .status(400)
        .send(ResponseObject.error("Invalid status value provided"));
      return;
    }

    const appointment = await AppointmentService.updateAppointmentStatus(
      Number(appointmentId),
      status as AppointmentStatusEnum,
      decodedToken,
    );
    res.send(ResponseObject.success(appointment));
  }),
);

export default router;
