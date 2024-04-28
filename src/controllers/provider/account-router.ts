import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import * as ProviderService from "../../services/provider-service";
import { AuthorizedRequest } from "../../types/authorized-request";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";

const router = express.Router();

router.delete(
  "/delete",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("provider-controller => account-router/delete");

    const { decodedToken } = req as AuthorizedRequest;

    await ProviderService.deleteProviderAccount(decodedToken.id);

    res.clearCookie("auth-token");

    res.send(ResponseObject.success());
  }),
);

export default router;
