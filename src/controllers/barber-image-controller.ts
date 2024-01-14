import express, { Request, Response } from "express";
import logger from "../util/logger";
import { ResponseObject } from "../util/response-object";

import * as ImageService from "../services/image-service";

import multer from "multer";
import { BarberImage } from "../entities/barber-image";
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
  "/barber-image/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    logger.info("Entering Image Controller => upload");

    const uploadedFile = req.file;

    if (!uploadedFile) {
      res.status(400).json(ResponseObject.error("Missing file"));
      return;
    }

    const user = verifyToken(req.cookies["auth-token"]);

    console.log(user);

    if (user.accountType !== RoleEnum.barber) {
      res.status(400).json(ResponseObject.error("User is not a barber"));
      return;
    }

    try {
      const imageUrl = await ImageService.uploadBarberImage(
        uploadedFile,
        user.id,
      );
      res.json(ResponseObject.success(imageUrl));
    } catch (err: any) {
      logger.error(err);
      res.status(500).json(ResponseObject.error("Error uploading image"));
    }
    logger.info("Exiting Image Controller => upload");
  },
);

router.delete("/barber-image/delete", async (req: Request, res: Response) => {
  logger.info("Entering Image Controller => delete");

  const image: BarberImage = req.body;

  if (!image.fileName) {
    res.status(400).json(ResponseObject.error("Missing file name"));
    return;
  }

  const user = verifyToken(req.cookies["auth-token"]);

  if (user.accountType !== RoleEnum.barber) {
    res.status(400).json(ResponseObject.error("User is not a barber"));
    return;
  }

  try {
    await ImageService.deleteBarberImage(user.id, image);
    res.json(ResponseObject.success("Image deleted successfully"));
  } catch (err: any) {
    logger.error(err);
    res.status(500).json(ResponseObject.error("Error deleting image"));
  }
  logger.info("Exiting Image Controller => delete");
});

export default router;
