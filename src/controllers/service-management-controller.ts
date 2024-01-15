import express, { Request, Response } from "express";
import { RoleEnum } from "../enums/role-enum";
import * as ServiceManagementService from "../services/service-management-service";
import { verifyToken } from "../util/jwt";
import logger from "../util/logger";
import { ResponseObject } from "../util/response-object";

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

router.get(
  "/service-management/get-services",
  async (req: Request, res: Response) => {
    logger.info("Entering Service Management Controller => get-services");

    const { barberId } = req.query;

    if (!barberId) {
      res
        .status(400)
        .json(ResponseObject.error("Missing required parameters: barberId"));
      return;
    }

    try {
      const services = await ServiceManagementService.getServices(
        Number(barberId),
      );

      res.json(ResponseObject.success(services));
    } catch (err: any) {
      logger.error(err);
      res.status(500).json(ResponseObject.error(err.message));
    }
    logger.info("Exiting Service Management Controller => get-services");
  },
);

router.post(
  "/service-management/create-service",
  async (req: Request, res: Response) => {
    logger.info("Entering Service Management Controller => create-service");

    const { name, hours, minutes, description, price } = req.body;
    const user = verifyToken(req.cookies["auth-token"]);

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
      res.status(400).json(ResponseObject.error(err.message));
      return;
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

      res.status(201).json(ResponseObject.success(service));
    } catch (err: any) {
      logger.error(err);
      res.status(500).json(ResponseObject.error(err.message));
    }
    logger.info("Exiting Service Management Controller => create-service");
  },
);

router.put(
  "/service-management/update-service",
  async (req: Request, res: Response) => {
    logger.info("Entering Service Management Controller => update-service");

    const { name, hours, minutes, description, price, id } = req.body;
    const user = verifyToken(req.cookies["auth-token"]);

    if (user.accountType !== RoleEnum.barber) {
      return res.status(403).json(ResponseObject.error("Unauthorized"));
    }

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
      return res.status(400).json(err.message);
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

      res.json(ResponseObject.success(updatedService));
    } catch (err: any) {
      logger.error(err);
      res.status(500).json(ResponseObject.error(err.message));
    }
    logger.info("Exiting Service Management Controller => update-service");
  },
);

router.delete(
  "/service-management/delete-service",
  async (req: Request, res: Response) => {
    logger.info("Entering Service Management Controller => delete-service");

    const { id } = req.query;
    const user = verifyToken(req.cookies["auth-token"]);

    if (!id) {
      return res
        .status(400)
        .json(ResponseObject.error("Missing required parameters: id"));
    }

    try {
      const response = await ServiceManagementService.deleteService(
        Number(id),
        user.id,
      );

      res.json(ResponseObject.success(response));
    } catch (err: any) {
      logger.error(err);
      res.status(500).json(ResponseObject.error(err.message));
    }
    logger.info("Exiting Service Management Controller => delete-service");
  },
);

export default router;
