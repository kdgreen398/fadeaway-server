import express, { Request, Response } from "express";
import multer from "multer";
import { ImageTypeEnum } from "../../enums/image-type-enum";
import * as ImageService from "../../services/image-service";
import { DecodedToken } from "../../util/jwt";
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

router.post(
  "/upload-gallery-photo",
  upload.single("image"),
  async (req: Request, res: Response) => {
    logger.info("image-controller => image-router/upload-gallery-photo");

    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res.status(400).json(ResponseObject.error("Missing file"));
    }

    const user = (req as any).user as DecodedToken;

    const { serviceId } = req.query;

    try {
      const imageUrl = await ImageService.uploadImage(
        uploadedFile,
        ImageTypeEnum.gallery,
        user.id,
        serviceId ? parseInt(serviceId as string) : null,
      );
      return res.json(ResponseObject.success(imageUrl));
    } catch (err: any) {
      logger.error(err);
      return res.status(500).json(ResponseObject.error(err.message));
    }
  },
);

router.put("/update-image-service", async (req: Request, res: Response) => {
  logger.info("image-controller => image-router/update-image-service");

  const user = (req as any).user as DecodedToken;

  const { serviceId, imageId } = req.query;

  if (!serviceId || !imageId) {
    return res.status(400).json(ResponseObject.error("Missing query params"));
  }

  try {
    const imageUrl = await ImageService.updateImageService(
      user.id,
      parseInt(serviceId as string),
      parseInt(imageId as string),
    );
    return res.json(ResponseObject.success(imageUrl));
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json(ResponseObject.error(err.message));
  }
});

router.delete("/delete", async (req: Request, res: Response) => {
  logger.info("image-controller => image-router/delete");

  const user = (req as any).user as DecodedToken;

  const { imageId, fileName } = req.query;

  if (!imageId) {
    return res.status(400).json(ResponseObject.error("Missing query params"));
  }

  try {
    const imageUrl = await ImageService.deleteImage(
      user.id,
      parseInt(imageId as string),
      fileName as string,
    );
    return res.json(ResponseObject.success(imageUrl));
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json(ResponseObject.error(err.message));
  }
});

export default router;
