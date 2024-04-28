import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import multer from "multer";
import { ImageTypeEnum } from "../../enums/image-type-enum";
import * as ImageService from "../../services/image-service";
import { AuthorizedRequest } from "../../types/authorized-request";
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
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("image-controller => image-router/upload-gallery-photo");

    const uploadedFile = req.file;

    if (!uploadedFile) {
      res.status(400).send(ResponseObject.error("Missing file"));
      return;
    }

    const { decodedToken } = req as AuthorizedRequest;

    const { serviceId } = req.query;

    const imageUrl = await ImageService.uploadImage(
      uploadedFile,
      ImageTypeEnum.gallery,
      decodedToken.id,
      serviceId ? parseInt(serviceId as string) : null,
    );
    res.send(ResponseObject.success(imageUrl));
  }),
);

router.put(
  "/update-image-service",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("image-controller => image-router/update-image-service");

    const { decodedToken } = req as AuthorizedRequest;

    const { serviceId, imageId } = req.query;

    if (!serviceId || !imageId) {
      res.status(400).send(ResponseObject.error("Missing query params"));
      return;
    }

    const imageUrl = await ImageService.updateImageService(
      decodedToken.id,
      parseInt(serviceId as string),
      parseInt(imageId as string),
    );
    res.send(ResponseObject.success(imageUrl));
  }),
);

router.delete(
  "/delete",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("image-controller => image-router/delete");

    const { decodedToken } = req as AuthorizedRequest;

    const { imageId, fileName } = req.query;

    if (!imageId) {
      res.status(400).send(ResponseObject.error("Missing query params"));
      return;
    }

    const imageUrl = await ImageService.deleteImage(
      decodedToken.id,
      parseInt(imageId as string),
      fileName as string,
    );
    res.send(ResponseObject.success(imageUrl));
  }),
);

export default router;
