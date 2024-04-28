import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import multer from "multer";
import * as ProviderService from "../../services/provider-service";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";

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
  expressAsyncHandler(async (req: Request, res: Response) => {
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
      res
        .status(400)
        .send(ResponseObject.error("Missing required body parameters"));
      return;
    }

    const providerDetails = await ProviderService.updateProviderProfileData(
      req.body,
      req.file,
    );

    res.send(ResponseObject.success(providerDetails));
  }),
);

export default router;
