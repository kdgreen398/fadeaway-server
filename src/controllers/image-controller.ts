import express, { Request, Response } from "express";
import logger from "../util/logger";
import { ResponseObject } from "../util/response-object";

import { Storage } from "@google-cloud/storage";
import multer from "multer";
import sharp from "sharp";

declare global {
  namespace Express {
    interface Request {
      fileValidationError?: string;
    }
  }
}

const router = express.Router();

const storage = new Storage();

const bucket = storage.bucket(process.env.CLOUD_IMAGE_STORAGE_BUCKET || "");

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

// Route for handling file upload
router.post(
  "/image/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    logger.info("Entering Image Controller => upload");

    if (req.fileValidationError) {
      return res
        .status(400)
        .json(ResponseObject.error(req.fileValidationError));
    }

    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res.status(400).json(ResponseObject.error("No file uploaded"));
    }

    try {
      // // Resize the image using sharp
      // const resizedImageBuffer = await sharp(uploadedFile.buffer)
      //   .resize({ width: 400, height: 400, fit: "inside" }) // Maintain aspect ratio
      //   .toBuffer();

      // Use sharp to compress the image and save it as JPEG
      const finalImageBuffer = await sharp(uploadedFile.buffer)
        .jpeg({ quality: 60 }) // Set the desired quality (0-100)
        .toBuffer();

      console.log("Image compressed and saved as JPEG successfully.");
      const fileName = Date.now() + "_" + uploadedFile.originalname;

      const file = bucket.file(fileName);
      const stream = file.createWriteStream({
        metadata: {
          contentType: uploadedFile.mimetype,
        },
      });

      stream.end(finalImageBuffer);

      stream.on("finish", () => {
        // File uploaded successfully
        res.json(
          ResponseObject.success("Image uploaded successfully: " + fileName),
        );
      });

      stream.on("error", (err) => {
        console.error("Error uploading", err);
        res.status(500).json(ResponseObject.error("Error uploading image"));
      });
    } catch (err: any) {
      logger.error(err);
      res.status(500).json(ResponseObject.error("Error uploading image"));
    }
    logger.info("Exiting Image Controller => upload");
  },
);

export default router;
