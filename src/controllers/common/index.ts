import express from "express";

import { ResponseObject } from "../../util/response-object";
import AccountRouter from "./account-router";
import AuthenticationRouter from "./authentication-router";
import LocationRouter from "./location-router";
import ProfileRouter from "./profile-router";

const router = express.Router();

router.get("/server-status", (req, res) => {
  res.json(ResponseObject.success("ok"));
});

router.use("/location", LocationRouter);

router.use("/authentication", AuthenticationRouter);

router.use("/account", AccountRouter);

router.use("/profile", ProfileRouter);

export default router;
