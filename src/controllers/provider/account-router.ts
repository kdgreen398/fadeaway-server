import express, { Request, Response } from "express";
import logger from "../../util/logger";
import * as ProviderService from "../../services/provider-service";
import { ResponseObject } from "../../util/response-object";
import { DecodedToken } from "../../util/jwt";

const router = express.Router();

router.delete("/delete", async (req: Request, res: Response) => {
  logger.info("provider-controller => account-router/delete");

  const user = (req as any).user as DecodedToken;

  try {
    await ProviderService.deleteProviderAccount(user.id);

    res.clearCookie("auth-token");

    res.json(ResponseObject.success());
  } catch (err: any) {
    logger.error(err);
    res.status(500).json(ResponseObject.error(err.message));
  }
});

export default router;
