import express, { Request, Response } from "express";
import { RoleEnum } from "../enums/role-enum";
import * as BusinessHoursService from "../services/business-hours-service";
import { verifyToken } from "../util/jwt";
import logger from "../util/logger";
import { ResponseObject } from "../util/response-object";

const router = express.Router();

router.post("/business-hours/create", async (req: Request, res: Response) => {
  logger.info("Entering BusinessHours Controller => POST /business-hours");

  const user = verifyToken(req.cookies["auth-token"]);
  if (user.accountType !== RoleEnum.barber) {
    res.status(401).json(ResponseObject.error("User is not a barber"));
    return;
  }

  try {
    const newBusinessHours = await BusinessHoursService.createBusinessHours(
      user.id,
      req.body,
    );
    res.json(ResponseObject.success(newBusinessHours));
  } catch (error: any) {
    logger.error(error);
    res.status(500).json(ResponseObject.error(error.message));
  }

  logger.info("Exiting BusinessHours Controller => POST /business-hours");
});

export default router;
