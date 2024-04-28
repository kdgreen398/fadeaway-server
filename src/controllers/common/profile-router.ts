import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { getProviderProfileData } from "../../services/provider-service";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";
const router = express.Router();

router.get(
  "/view",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("common-controller => profile-router/view");

    const username = req.query.username as string;

    if (!username) {
      res.status(400).send(ResponseObject.error("Username is required"));
      return;
    }

    const profile = await getProviderProfileData(username);

    res.send(ResponseObject.success(profile));
  }),
);

export default router;
