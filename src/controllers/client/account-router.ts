import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import * as ClientService from "../../services/client-service";
import { AuthorizedRequest } from "../../types/authorized-request";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";

const router = express.Router();

router.delete(
  "/delete",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("client-controller => account-router/delete");

    const { decodedToken } = req as AuthorizedRequest;

    await ClientService.deleteAccount(decodedToken.id);

    res.clearCookie("auth-token");

    res.send(ResponseObject.success());
  }),
);

export default router;
