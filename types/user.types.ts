import { ROLES } from "../constants/userRoles";

export type User = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: number;
  role?: (typeof ROLES)[keyof typeof ROLES];
};
