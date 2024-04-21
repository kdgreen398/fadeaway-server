import express from "express";

import { RoleEnum } from "../../enums/role-enum";
import { verifyRole } from "../../middleware/role-validation";
import AccountRouter from "./account-router";
import AppointmentRouter from "./appointment-router";
import ReviewRouter from "./review-router";

const router = express.Router();

router.use(verifyRole(RoleEnum.client));

router.use("/account", AccountRouter);

router.use("/appointment", AppointmentRouter);

router.use("/review", ReviewRouter);

export default router;
