import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "../enums/role-enum";
import { AuthorizedRequest } from "../types/authorized-request";
import { verifyToken } from "../util/jwt";
import { ResponseObject } from "../util/response-object";

export function verifyRole(role: RoleEnum) {
  return (req: Request, res: Response, next: NextFunction) => {
    // get auth token from cookies
    const token = req.cookies["auth-token"];

    try {
      const decodedToken = verifyToken(token);
      if (decodedToken.role !== role) {
        throw new Error();
      }
      (req as AuthorizedRequest).decodedToken = decodedToken;
      next();
    } catch {
      res.status(401).send(ResponseObject.error("Unauthorized"));
    }
  };
}
