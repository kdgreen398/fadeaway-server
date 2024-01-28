import express, { Request, Response } from "express";

import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";
import { getProviderProfileData } from "../../services/provider-service";
const router = express.Router();

router.get("/view", async (req: Request, res: Response) => {
  logger.info("common-controller => profile-router/view");

  const username = req.query.username as string;

  if (!username) {
    return res.status(400).send(ResponseObject.error("Username is required"));
  }

  try {
    const profile = await getProviderProfileData(username);

    return res.json(ResponseObject.success(profile));
  } catch (err: any) {
    logger.error(err);
    return res.status(500).send(ResponseObject.error(err.message));
  }
});

export default router;
