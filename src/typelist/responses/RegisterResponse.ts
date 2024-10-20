import { User } from "../schemas";

export type TRegisterResponse = {
  accessToken: string;
  userData: User;
};
