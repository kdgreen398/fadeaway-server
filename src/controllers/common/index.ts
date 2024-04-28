import express from "express";

import AccountRouter from "./account-router";
import AuthenticationRouter from "./authentication-router";
import LocationRouter from "./location-router";
import ProfileRouter from "./profile-router";

const router = express.Router();

router.use("/location", LocationRouter);

router.use("/authentication", AuthenticationRouter);

router.use("/account", AccountRouter);

router.use("/profile", ProfileRouter);

export default router;
