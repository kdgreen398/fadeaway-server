import express, { Request, Response } from "express";
import logger from "../../util/logger";
import * as ProviderService from "../../services/provider-service";
import { ResponseObject } from "../../util/response-object";
import multer from "multer";

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

router.put(
  "/update",
  upload.single("image"),
  async (req: Request, res: Response) => {
    logger.info("provider-controller => profile-router/update");

    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.shop ||
      !req.body.addressLine1 ||
      !req.body.city ||
      !req.body.state ||
      !req.body.zipCode
    ) {
      return res
        .status(400)
        .json(ResponseObject.error("Missing required body parameters"));
    }

    try {
      const providerDetails = await ProviderService.updateProviderProfileData(
        req.body,
        req.file,
      );

      return res.json(ResponseObject.success(providerDetails));
    } catch (err: any) {
      logger.error(err);
      return res.status(500).json(ResponseObject.error(err.message));
    }
  },
);

export default router;
