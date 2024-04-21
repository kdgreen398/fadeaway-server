import express from "express";

import { RoleEnum } from "../../enums/role-enum";
import { verifyRole } from "../../middleware/role-validation";
import AccountRouter from "./account-router";
import AppointmentRouter from "./appointment-router";
import BusinessHoursRouter from "./business-hours-router";
import ImageRouter from "./image-router";
import ProfileRouter from "./profile-router";
import ServiceRouter from "./service-router";

const router = express.Router();

router.use(verifyRole(RoleEnum.provider));

router.use("/account", AccountRouter);

router.use("/appointment", AppointmentRouter);

router.use("/profile", ProfileRouter);

router.use("/service", ServiceRouter);

router.use("/business-hours", BusinessHoursRouter);

router.use("/image", ImageRouter);

export default router;
