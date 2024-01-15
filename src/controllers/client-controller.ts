import express, { Request, Response } from "express";
import { RoleEnum } from "../enums/role-enum";
import * as ClientService from "../services/client-service";
import { verifyToken } from "../util/jwt";
import logger from "../util/logger";
import { ResponseObject } from "../util/response-object";

const router = express.Router();

router.delete("/client/delete-account", async (req: Request, res: Response) => {
  logger.info("Entering Client Controller => delete-account");

  const user = verifyToken(req.cookies["auth-token"]);

  if (user.accountType !== RoleEnum.client) {
    res.status(403).json(ResponseObject.error("Unauthorized"));
    return;
  }

  try {
    await ClientService.deleteAccount(user.id);

    res.clearCookie("auth-token");

    res.json(ResponseObject.success(user));
  } catch (err: any) {
    logger.error(err);
    res.status(500).json(ResponseObject.error(err.message));
  }

  logger.info("Exiting Client Controller => delete-account");
});

export default router;
