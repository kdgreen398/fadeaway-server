import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import * as BusinessHoursService from "../../services/business-hours-service";
import { AuthorizedRequest } from "../../types/authorized-request";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";

const router = express.Router();

router.put(
  "/update",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("provider-controller => business-hours-router/update");

    const { decodedToken } = req as AuthorizedRequest;

    const newBusinessHours = await BusinessHoursService.updateBusinessHours(
      decodedToken.id,
      req.body,
    );
    res.send(ResponseObject.success(newBusinessHours));
  }),
);

export default router;
