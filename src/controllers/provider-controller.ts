import express, { Request, Response } from "express";
import multer from "multer";
import { RoleEnum } from "../enums/role-enum";
import * as ProviderService from "../services/provider-service";
import { verifyToken } from "../util/jwt";
import logger from "../util/logger";
import { ResponseObject } from "../util/response-object";

const router = express.Router();

const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Please upload an image."));
    }
  },
});

router.get(
  "/provider/fetch-provider-details",
  async (req: Request, res: Response) => {
    logger.info("Entering Provider Controller => fetch-provider-details");

    const { id } = req.query;

    if (!id) {
      res
        .status(400)
        .json(
          ResponseObject.error("Missing required query parameter: publicId"),
        );
      return;
    }

    try {
      const providerDetails = await ProviderService.getProviderProfileData(
        Number(id),
      );

      if (!providerDetails) {
        res.status(404).json(ResponseObject.error("Provider not found"));
        return;
      }

      res.json(ResponseObject.success(providerDetails));
    } catch (err: any) {
      logger.error(err);
      res.status(500).json(ResponseObject.error(err.message));
    }
    logger.info("Exiting Provider Controller => fetch-provider-details");
  },
);

router.put(
  "/provider/update-provider-details",
  upload.single("image"),
  async (req: Request, res: Response) => {
    logger.info("Entering Provider Controller => update-provider-details");

    const user = verifyToken(req.cookies["auth-token"]);

    if (user.accountType !== RoleEnum.provider) {
      res.status(403).json(ResponseObject.error("Unauthorized"));
      return;
    }

    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.shop ||
      !req.body.addressLine1 ||
      !req.body.city ||
      !req.body.state ||
      !req.body.zipCode
    ) {
      res
        .status(400)
        .json(ResponseObject.error("Missing required body parameters"));
      return;
    }

    try {
      const providerDetails = await ProviderService.updateProviderDetails(
        req.body,
        req.file,
        // user.id,
      );

      res.json(ResponseObject.success(providerDetails));
    } catch (err: any) {
      logger.error(err);
      res.status(500).json(ResponseObject.error(err.message));
    }
    logger.info("Exiting Provider Controller => update-provider-details");
  },
);

router.delete(
  "/provider/delete-account",
  async (req: Request, res: Response) => {
    logger.info("Entering Provider Controller => delete-account");

    const user = verifyToken(req.cookies["auth-token"]);

    if (user.accountType !== RoleEnum.provider) {
      res.status(403).json(ResponseObject.error("Unauthorized"));
      return;
    }

    try {
      await ProviderService.deleteProviderAccount(user.id);

      res.clearCookie("auth-token");

      res.json(ResponseObject.success(user));
    } catch (err: any) {
      logger.error(err);
      res.status(500).json(ResponseObject.error(err.message));
    }

    logger.info("Exiting Provider Controller => delete-account");
  },
);

export default router;
