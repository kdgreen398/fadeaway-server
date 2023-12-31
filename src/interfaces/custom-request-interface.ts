import { Request } from "express";
import { DecodedToken } from "./decoded-token-interface";

export interface CustomRequest extends Request {
  decodedToken: DecodedToken;
}
