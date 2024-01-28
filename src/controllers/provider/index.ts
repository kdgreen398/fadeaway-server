import express, { NextFunction, Request, Response } from "express";

import AccountRouter from "./account-router";
import AppointmentRouter from "./appointment-router";
import { RoleEnum } from "../../enums/role-enum";
import { verifyRole } from "../../middleware/role-validation";
import ProfileRouter from "./profile-router";
import ServiceRouter from "./service-router";

const router = express.Router();

router.use(verifyRole(RoleEnum.provider));

router.use("/account", AccountRouter);

router.use("/appointment", AppointmentRouter);

router.use("/profile", ProfileRouter);

router.use("/service", ServiceRouter);

export default router;
