import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import * as ServiceManagementService from "../../services/service-management-service";
import { AuthorizedRequest } from "../../types/authorized-request";
import logger from "../../util/logger";
import { ResponseObject } from "../../util/response-object";

const router = express.Router();

function validateParameters(hours: number, minutes: number, price: number) {
  if (
    !Number.isInteger(minutes) ||
    !Number.isInteger(hours) ||
    !Number.isInteger(price)
  ) {
    return {
      error: "Invalid values: minutes, hours, and price must be whole numbers",
    };
  }

  if (hours < 0 || minutes < 0 || price < 0) {
    return {
      error: "Invalid values: minutes, hours, and price must be greater than 0",
    };
  }

  if (hours === 0 && minutes === 0) {
    return { error: "Invalid time: hours and minutes cannot both be 0" };
  }

  if (price === 0) {
    return { error: "Invalid price: price cannot be 0" };
  }

  if (price > 999) {
    return { error: "Invalid price: price cannot be greater than 999" };
  }

  if (hours >= 24 || minutes >= 60) {
    return {
      error:
        "Invalid time: minutes must be less than 60 and hours less than 24",
    };
  }

  if (minutes % 15 !== 0) {
    return { error: "Invalid time: minutes must be a multiple of 15" };
  }
  return { error: null };
}

router.post(
  "/create",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("provider-controller => service-router/create");

    const { name, hours, minutes, description, price } = req.body;

    const { decodedToken } = req as AuthorizedRequest;
    if (
      !name ||
      (!hours && hours !== 0) ||
      (!minutes && minutes !== 0) ||
      (!price && price !== 0)
    ) {
      res
        .status(400)
        .send(
          ResponseObject.error(
            "Missing required parameters: name, hours, minutes, price",
          ),
        );
      return;
    }
    const { error } = validateParameters(hours, minutes, price);
    if (error) {
      res.status(400).send(ResponseObject.error(error));
      return;
    }

    const service = await ServiceManagementService.createService(
      name,
      hours,
      minutes,
      description,
      price,
      decodedToken.id,
    );

    res.status(201).send(ResponseObject.success(service));
  }),
);

router.put(
  "/update",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("provider-controller => service-router/update");

    const { name, hours, minutes, description, price, id } = req.body;

    const { decodedToken } = req as AuthorizedRequest;

    if (
      !name ||
      (!hours && hours !== 0) ||
      (!minutes && minutes !== 0) ||
      (!price && price !== 0) ||
      !id
    ) {
      res
        .status(400)
        .send(
          ResponseObject.error(
            "Missing required parameters: name, hours, minutes, price, id",
          ),
        );
      return;
    }
    const { error } = validateParameters(hours, minutes, price);
    if (error) {
      res.status(400).send(ResponseObject.error(error));
      return;
    }

    const updatedService = await ServiceManagementService.updateService(
      name,
      hours,
      minutes,
      description,
      price,
      id,
      decodedToken.id,
    );

    res.send(ResponseObject.success(updatedService));
  }),
);

router.delete(
  "/delete",
  expressAsyncHandler(async (req: Request, res: Response) => {
    logger.info("provider-controller => service-router/delete");

    const { serviceId } = req.query;
    const { decodedToken } = req as AuthorizedRequest;

    if (!serviceId) {
      res
        .status(400)
        .send(ResponseObject.error("Missing required parameters: id"));
      return;
    }

    const response = await ServiceManagementService.deleteService(
      Number(serviceId),
      decodedToken.id,
    );

    res.send(ResponseObject.success(response));
  }),
);

export default router;
