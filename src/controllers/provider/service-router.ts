import express, { Request, Response } from "express";
import logger from "../../util/logger";
import * as ProviderService from "../../services/provider-service";
import { ResponseObject } from "../../util/response-object";
import multer from "multer";
import { RoleEnum } from "../../enums/role-enum";
import { DecodedToken } from "../../util/jwt";
import * as ServiceManagementService from "../../services/service-management-service";

const router = express.Router();

function validateParameters(hours: number, minutes: number, price: number) {
  if (
    !Number.isInteger(minutes) ||
    !Number.isInteger(hours) ||
    !Number.isInteger(price)
  ) {
    throw new Error(
      "Invalid values: minutes, hours, and price must be whole numbers",
    );
  }

  if (hours < 0 || minutes < 0 || price < 0) {
    throw new Error(
      "Invalid values: minutes, hours, and price must be greater than 0",
    );
  }

  if (hours === 0 && minutes === 0) {
    throw new Error("Invalid time: hours and minutes cannot both be 0");
  }

  if (price === 0) {
    throw new Error("Invalid price: price cannot be 0");
  }

  if (price > 999) {
    throw new Error("Invalid price: price cannot be greater than 999");
  }

  if (hours >= 24 || minutes >= 60) {
    throw new Error(
      "Invalid time: minutes must be less than 60 and hours less than 24",
    );
  }

  if (minutes % 15 !== 0) {
    throw new Error("Invalid time: minutes must be a multiple of 15");
  }
}

router.post("/create", async (req: Request, res: Response) => {
  logger.info("provider-controller => service-router/create");

  const { name, hours, minutes, description, price } = req.body;

  const user = (req as any).user as DecodedToken;

  if (user.role !== RoleEnum.provider) {
    return res.status(403).json(ResponseObject.error("Unauthorized"));
  }

  try {
    if (
      !name ||
      (!hours && hours !== 0) ||
      (!minutes && minutes !== 0) ||
      (!price && price !== 0)
    ) {
      throw new Error(
        "Missing required parameters: name, hours, minutes, price",
      );
    }
    validateParameters(hours, minutes, price);
  } catch (err: any) {
    logger.error(err);
    return res.status(400).json(ResponseObject.error(err.message));
  }

  try {
    const service = await ServiceManagementService.createService(
      name,
      hours,
      minutes,
      description,
      price,
      user.id,
    );

    return res.status(201).json(ResponseObject.success(service));
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json(ResponseObject.error(err.message));
  }
});

router.put("/update", async (req: Request, res: Response) => {
  logger.info("provider-controller => service-router/update");

  const { name, hours, minutes, description, price, id } = req.body;

  const user = (req as any).user as DecodedToken;

  try {
    if (
      !name ||
      (!hours && hours !== 0) ||
      (!minutes && minutes !== 0) ||
      (!price && price !== 0) ||
      !id
    ) {
      return res
        .status(400)
        .json(
          ResponseObject.error(
            "Missing required parameters: name, hours, minutes, price, id",
          ),
        );
    }
    validateParameters(hours, minutes, price);
  } catch (err: any) {
    logger.error(err);
    return res.status(400).json(ResponseObject.error(err.message));
  }

  try {
    const updatedService = await ServiceManagementService.updateService(
      name,
      hours,
      minutes,
      description,
      price,
      id,
      user.id,
    );

    return res.json(ResponseObject.success(updatedService));
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json(ResponseObject.error(err.message));
  }
});

router.delete("/delete", async (req: Request, res: Response) => {
  logger.info("provider-controller => service-router/delete");

  const { serviceId } = req.query;
  const user = (req as any).user as DecodedToken;

  if (!serviceId) {
    return res
      .status(400)
      .json(ResponseObject.error("Missing required parameters: id"));
  }

  try {
    const response = await ServiceManagementService.deleteService(
      Number(serviceId),
      user.id,
    );

    return res.json(ResponseObject.success(response));
  } catch (err: any) {
    logger.error(err);
    return res.status(500).json(ResponseObject.error(err.message));
  }
});

export default router;
