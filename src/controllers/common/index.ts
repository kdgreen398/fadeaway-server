import express, { Request, Response } from "express";

import AuthenticationRouter from "./authentication-router";
import AccountRouter from "./account-router";
import ProfileRouter from "./profile-router";

const router = express.Router();

router.use("/authentication", AuthenticationRouter);

router.use("/account", AccountRouter);

router.use("/profile", ProfileRouter);

export default router;
