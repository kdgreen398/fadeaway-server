import express, { Request, Response } from "express";
import logger from "../util/logger";
import { ResponseObject } from "../util/response-object";

import * as ImageService from "../services/image-service";

import multer from "multer";
import { Image } from "../entities/image";
import { ImageTypeEnum } from "../enums/image-type-enum";
import { RoleEnum } from "../enums/role-enum";
import { verifyToken } from "../util/jwt";

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

router.post(
  "/image/upload-gallery-photo",
  upload.single("image"),
  async (req: Request, res: Response) => {
    logger.info("Entering Image Controller => upload-gallery-photo");

    const uploadedFile = req.file;

    if (!uploadedFile) {
      res.status(400).json(ResponseObject.error("Missing file"));
      return;
    }

    const user = verifyToken(req.cookies["auth-token"]);

    if (user.accountType !== RoleEnum.provider) {
      res.status(400).json(ResponseObject.error("User is not a provider"));
      return;
    }

    const { serviceId } = req.query;

    try {
      const imageUrl = await ImageService.uploadImage(
        uploadedFile,
        ImageTypeEnum.gallery,
        user.id,
        serviceId ? parseInt(serviceId as string) : null,
      );
      res.json(ResponseObject.success(imageUrl));
    } catch (err: any) {
      logger.error(err);
      res.status(500).json(ResponseObject.error(err.message));
    }
    logger.info("Exiting Image Controller => upload-gallery-photo");
  },
);

router.delete("/image/delete", async (req: Request, res: Response) => {
  logger.info("Entering Image Controller => delete");

  const image: Image = req.body;

  if (!image.fileName) {
    res.status(400).json(ResponseObject.error("Missing file name"));
    return;
  }

  const user = verifyToken(req.cookies["auth-token"]);

  if (user.accountType !== RoleEnum.provider) {
    res.status(400).json(ResponseObject.error("User is not a provider"));
    return;
  }

  try {
    await ImageService.deleteImage(user.id, image);
    res.json(ResponseObject.success("Image deleted successfully"));
  } catch (err: any) {
    logger.error(err);
    res.status(500).json(ResponseObject.error(err.message));
  }
  logger.info("Exiting Image Controller => delete");
});

export default router;
