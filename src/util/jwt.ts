import { RoleEnum } from "../enums/role-enum";

const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY; // Replace with your actual secret key

export interface DecodedToken {
  firstName: string;
  lastName: string;
  email: string;
  id: number;
  accountType: RoleEnum;
}

export function verifyToken(token: string): DecodedToken {
  return jwt.verify(token, secretKey);
}

export function generateToken(tokenPayload: any): string {
  return jwt.sign(tokenPayload, secretKey, { expiresIn: "24h" });
}
