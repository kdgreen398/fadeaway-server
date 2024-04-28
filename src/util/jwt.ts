import { RoleEnum } from "../enums/role-enum";

import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET_KEY; // Replace with your actual secret key

export interface DecodedToken {
  firstName: string;
  lastName: string;
  email: string;
  id: number;
  role: RoleEnum;
}

export function verifyToken(token: string): DecodedToken {
  if (!secretKey) {
    throw new Error("JWT secret key not set");
  }
  return jwt.verify(token, secretKey) as DecodedToken;
}

export function generateToken(tokenPayload: DecodedToken): string {
  if (!secretKey) {
    throw new Error("JWT secret key not set");
  }
  return jwt.sign(tokenPayload, secretKey, { expiresIn: "24h" });
}
