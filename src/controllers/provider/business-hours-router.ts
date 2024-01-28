import express, { Request, Response } from "express";
import * as BusinessHoursService from "../../services/business-hours-service";
import { DecodedToken } from "../../util/jwt";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";

const router = express.Router();

router.put("/update", async (req: Request, res: Response) => {
  logger.info("provider-controller => business-hours-router/update");

  const user = (req as any).user as DecodedToken;

  try {
    const newBusinessHours = await BusinessHoursService.updateBusinessHours(
      user.id,
      req.body,
    );
    res.json(ResponseObject.success(newBusinessHours));
  } catch (error: any) {
    logger.error(error);
    res.status(500).json(ResponseObject.error(error.message));
  }
});

export default router;
