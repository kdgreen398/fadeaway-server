import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import * as ReviewService from "../../services/review-service";
import { AuthorizedRequest } from "../../types/authorized-request";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";

const router = express.Router();

router.post(
  "/create",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("client-controller => create");

    const { decodedToken } = req as AuthorizedRequest;

    if (!req.body.rating || !req.body.providerId) {
      res.status(400).send(ResponseObject.error("Missing required fields"));
      return;
    }

    const review = await ReviewService.createReview(
      Math.floor(Number(req.body.rating)),
      req.body.description,
      req.body.providerId,
      decodedToken.id,
    );

    res.send(ResponseObject.success(review));
  }),
);

export default router;
