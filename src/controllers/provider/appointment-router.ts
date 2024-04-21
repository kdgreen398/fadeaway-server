import express, { Request, Response } from "express";
import logger from "../../util/logger";
import * as AppointmentService from "../../services/appointment-service";
import { ResponseObject } from "../../util/response-object";
import { DecodedToken } from "../../util/jwt";
import { RoleEnum } from "../../enums/role-enum";
import { AppointmentStatusEnum } from "../../enums/appointment-status-enum";

const router = express.Router();

router.get("/view-all", async (req: Request, res: Response) => {
  logger.info("provider-controller => appointment-router/view-all");

  try {
    const user = (req as any).user as DecodedToken;
    const appointments = await AppointmentService.getAppointments(
      user.id,
      RoleEnum.provider,
    );
    return res.json(ResponseObject.success(appointments));
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json(ResponseObject.error(error.message));
  }
});

router.put("/update-status", async (req: Request, res: Response) => {
  logger.info("provider-controller => appointment-router/update-status");

  if (!req.query.appointmentId || !req.query.status) {
    return res
      .status(400)
      .json(ResponseObject.error("Missing required fields"));
  }

  const user = (req as any).user as DecodedToken;
  const { appointmentId } = req.query;
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
      Number(appointmentId),
      status as AppointmentStatusEnum,
      user,
    );
    return res.json(ResponseObject.success(appointment));
  } catch (error: any) {
    logger.error(error);
    return res.status(500).json(ResponseObject.error(error.message));
  }
});

export default router;
