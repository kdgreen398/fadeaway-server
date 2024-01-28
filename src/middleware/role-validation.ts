import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "../enums/role-enum";
import { verifyToken } from "../util/jwt";

export function verifyRole(role: RoleEnum) {
  return (req: Request, res: Response, next: NextFunction) => {
    // get auth token from cookies
    const token = req.cookies["auth-token"];

    try {
      const user = verifyToken(token);
      if (user.role !== role) {
        throw new Error();
      }
      (req as any).user = user;
      next();
    } catch {
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}
