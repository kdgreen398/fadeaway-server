import { Request } from "express";
import { DecodedToken } from "../util/jwt";

export interface AuthorizedRequest extends Request {
  decodedToken: DecodedToken;
}
