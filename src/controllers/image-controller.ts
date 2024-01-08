import axios from "axios";
import express, { Request, Response } from "express";
import logger from "../util/logger";
import { ResponseObject } from "../util/response-object";

const router = express.Router();

// https://storage.googleapis.com/booking-app-image-bucket/tired%20steve.png

router.post("/image/upload", async (req: Request, res: Response) => {
  logger.info("Entering Image Controller => upload");

  // const { id } = req.query;

  try {
    res.json(ResponseObject.success("Image uploaded successfully"));
  } catch (err: any) {
    logger.error(err);
    res.status(500).json(ResponseObject.error("Error uploading image"));
  }
  logger.info("Exiting Image Controller => upload");
});

router.get("/image/view/:imageName", async (req: Request, res: Response) => {
  logger.info("Entering Image Controller => view");

  const { imageName } = req.params;

  console.log(imageName);

  try {
    const response = await axios(
      "https://storage.googleapis.com/booking-app-image-bucket/tired%20steve.png",
    );
    // console.log(response);
    res.json(ResponseObject.success(response.data));
  } catch (err: any) {
    logger.error(err);
    res.status(500).json(ResponseObject.error("Error viewing image"));
  }
  logger.info("Exiting Image Controller => view");
});

export default router;
