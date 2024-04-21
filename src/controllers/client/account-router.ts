import express, { Request, Response } from "express";
import * as ClientService from "../../services/client-service";
import { DecodedToken } from "../../util/jwt";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";

const router = express.Router();

router.delete("/delete", async (req: Request, res: Response) => {
  logger.info("client-controller => account-router/delete");

  const user = (req as any).user as DecodedToken;

  try {
    await ClientService.deleteAccount(user.id);

    res.clearCookie("auth-token");

    return res.json(ResponseObject.success());
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json(ResponseObject.error(err.message));
  }
});

export default router;
