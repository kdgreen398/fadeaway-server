import { RoleEnum } from "../enums/role-enum";

export interface DecodedToken {
  firstName: string;
  lastName: string;
  email: string;
  id: number;
  role: RoleEnum;
}
