import express, { Request, Response } from "express";
import * as ReviewService from "../services/review-service";

import { RoleEnum } from "../enums/role-enum";
import { verifyToken } from "../util/jwt";
import logger from "../util/logger";
import { ResponseObject } from "../util/response-object";

const router = express.Router();

router.post("/review/create-review", async (req: Request, res: Response) => {
  logger.info("Entering Review Controller => create-review");

  const user = verifyToken(req.cookies["auth-token"]);

  if (user.accountType !== RoleEnum.client) {
    return res.status(401).json(ResponseObject.error("Unauthorized"));
  }

  if (!req.body.rating || !req.body.providerId) {
    return res
      .status(400)
      .send(ResponseObject.error("Missing required fields"));
  }

  try {
    const review = await ReviewService.createReview(
      Math.floor(Number(req.body.rating)),
      req.body.description,
      req.body.providerId,
      user.id,
    );

    logger.info("Exiting Review Controller => create-review");
    res.json(ResponseObject.success(review));
  } catch (err: any) {
    logger.error(err);
    res.status(500).json(ResponseObject.error(err.message));
  }
});

export default router;
