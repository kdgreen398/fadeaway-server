import { DecodedToken } from "../interfaces/decoded-token-interface";

const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY; // Replace with your actual secret key

export function verifyToken(token: string): DecodedToken {
  return jwt.verify(token, secretKey);
}

export function generateToken(tokenPayload: any): string {
  return jwt.sign(tokenPayload, secretKey, { expiresIn: "24h" });
}
